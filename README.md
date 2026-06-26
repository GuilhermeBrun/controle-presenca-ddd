# Trabalho — Design Tático no DDD

Implementação em TypeScript do domínio **Controle de Presença**, usando Entidades, Value Objects, Aggregate Root, Repositório, Eventos de Domínio e invariantes de negócio. O projeto também inclui uma pequena modelagem do contexto **Gestão Acadêmica** para representar `Pessoa`, `Aluno` e `Professor`.

## 1) Sobre o Domínio Escolhido

**Nome do domínio:** Controle de Presença

**Objetivo do sistema:** simplificar o processo de chamada dos professores, garantindo o registro correto da presença dos alunos em cada aula.

**Principais atores:** professor, aluno e coordenação acadêmica.

**Bounded Contexts propostos:**

| Origem | Destino | Tipo de relacionamento | Explicação |
|---|---|---|---|
| Gestão Acadêmica (U) | Controle de Presença (D) | Customer/Supplier | Fornece professores, alunos, turmas, aulas e matrículas para a realização da chamada. |
| Integrações Externas (U) | Controle de Presença (D) | ACL | Traduz dados externos, como participantes do Teams, para registros de presença do sistema. |
| Controle de Presença (U) | Acompanhamento de Frequência (D) | Published Language | Publica presenças e faltas para cálculo da frequência e risco de reprovação. |
| Controle de Presença (U) | Relatórios e Exportações (D) | Published Language | Disponibiliza dados validados das chamadas para relatórios em PDF, Excel e JSON. |
| Acompanhamento de Frequência (U) | Notificações de Faltas (D) | Published Language | Publica alertas de frequência para envio de notificações. |

Legenda: **U** = Upstream, **D** = Downstream, **ACL** = Anti-Corruption Layer.

## 2) Entidades vs Value Objects

| Elemento | Tipo | Por quê? |
|---|---|---|
| `Pessoa` | Entidade abstrata | Possui identidade e concentra dados comuns de pessoas, como nome e e-mail. |
| `Aluno` | Entidade | É uma pessoa com matrícula acadêmica. |
| `Professor` | Entidade | É uma pessoa com registro docente. |
| `Chamada` | Entidade / Aggregate Root | Possui identidade própria e ciclo de vida: planejada, aberta e encerrada. |
| `RegistroDePresenca` | Entidade interna | Possui identidade própria dentro da chamada e representa o registro individual de um aluno. |
| `CodigoChamada` | Value Object | É imutável e validado pelo valor, com 6 caracteres alfanuméricos. |
| `JanelaResposta` | Value Object | Representa início e fim do período de resposta, com igualdade por valor. |
| `NomePessoa` | Value Object | Representa um nome validado e comparado por valor. |
| `EmailInstitucional` | Value Object | Representa um e-mail validado e comparado por valor. |
| `AlunoId`, `ProfessorId`, `TurmaId`, `AulaId` | Value Object | São identificadores semânticos usados para referenciar outros agregados por ID. |

`Aluno` e `Professor` herdam de `Pessoa` porque compartilham dados comuns. Mesmo assim, eles não ficam dentro do agregado `Chamada`; a chamada mantém apenas `AlunoId` e `ProfessorId`.

## 3) Agregados e Aggregate Root

**Agregado Principal:** `Chamada`

**Conteúdo interno do agregado:**

- `RegistroDePresenca`
- `CodigoChamada`
- `JanelaResposta`
- `StatusChamada`

**Referências a outros agregados por ID:**

- `AulaId`
- `TurmaId`
- `ProfessorId`
- `AlunoId`

O agregado `Chamada` não contém objetos completos de aluno, professor, turma ou aula. Ele guarda apenas os IDs, porque esses conceitos pertencem ao contexto de Gestão Acadêmica.

**Contexto Gestão Acadêmica:**

```text
Pessoa
├── Aluno
└── Professor
```

`Pessoa` é uma entidade abstrata usada para compartilhar atributos comuns. `Aluno` e `Professor` são entidades diferentes porque possuem papéis e dados específicos no domínio acadêmico.

## 4) Invariantes e Máquina de Estados

**Invariantes:**

- Uma chamada precisa ter pelo menos um aluno esperado.
- Apenas chamadas planejadas podem ser iniciadas.
- Presença só pode ser registrada quando a chamada está aberta.
- O código informado pelo aluno deve ser igual ao código da chamada.
- O registro deve acontecer dentro da janela de resposta.
- O aluno precisa pertencer à turma da chamada.
- Um aluno não pode ter dois registros na mesma chamada.
- Ao encerrar a chamada, alunos sem presença recebem falta automaticamente.
- Chamada encerrada não pode receber novos registros.

**Estados e transições da AR `Chamada`:**

```text
Planejada -> Aberta -> Encerrada

Regras:
- Planejada -> Aberta: permitido quando a janela de resposta é válida.
- Aberta -> Aberta: permitido ao registrar presença dentro da janela e com código correto.
- Aberta -> Encerrada: gera falta para alunos sem registro.
- Encerrada -> Aberta: bloqueado.
- Encerrada -> RegistrarPresenca: bloqueado.
```

## 5) Repositório do Agregado

O repositório trabalha apenas com a Aggregate Root `Chamada`.

```ts
export interface ChamadaRepository {
  obterPorId(id: ChamadaId): Promise<Chamada | null>;
  adicionar(chamada: Chamada): Promise<void>;
  salvar(chamada: Chamada): Promise<void>;
}
```

Implementação criada:

- `src/presenca/domain/repositories/ChamadaRepository.ts`
- `src/presenca/infrastructure/InMemoryChamadaRepository.ts`

## 6) Eventos de Domínio

| Evento | Quando ocorre | Payload mínimo | Interno/Integração | Observações |
|---|---|---|---|---|
| ChamadaCriada | Ao criar uma chamada planejada | chamadaId, aulaId, turmaId | Interno | Pode alimentar histórico da aula. |
| ChamadaIniciada | Ao abrir a chamada | chamadaId, código, início, fim | Interno | Define o período em que alunos podem responder. |
| PresencaRegistrada | Quando um aluno registra presença | chamadaId, alunoId, registradoEm | Integração | Pode ser consumido por frequência e relatórios. |
| FaltaRegistrada | Ao encerrar chamada com aluno ausente | chamadaId, alunoId, registradoEm | Integração | Pode ser consumido pelo acompanhamento de frequência. |
| ChamadaEncerrada | Quando a chamada é finalizada | chamadaId, totalPresentes, totalFaltas | Integração | Pode disparar relatórios e atualização de frequência. |

## 7) Como Executar

```bash
npm install
npm run build
npm start
```

O arquivo `src/index.ts` demonstra o fluxo:

1. cria um professor e três alunos no contexto de Gestão Acadêmica;
2. cria uma chamada usando apenas os IDs do professor e dos alunos;
3. abre a chamada com código e janela de resposta;
4. registra presença de dois alunos;
5. encerra a chamada;
6. gera falta para o aluno ausente;
7. exibe os eventos gerados.

## 8) Diagrama

```mermaid
classDiagram
  class Chamada {
    +ChamadaId id
    +AulaId aulaId
    +TurmaId turmaId
    +ProfessorId professorId
    +StatusChamada status
    +iniciar(janela, codigo)
    +registrarPresenca(alunoId, codigo, momento)
    +encerrar(momento)
  }

  class RegistroDePresenca {
    +RegistroDePresencaId id
    +AlunoId alunoId
    +TipoRegistroPresenca tipo
    +Date registradoEm
  }

  class Pessoa {
    +EntityId id
    +NomePessoa nome
    +EmailInstitucional email
  }

  class Aluno {
    +AlunoId id
    +string matricula
  }

  class Professor {
    +ProfessorId id
    +string registroDocente
  }

  class CodigoChamada {
    +string value
    +create(value)
    +generate()
  }

  class JanelaResposta {
    +Date inicio
    +Date fim
    +contem(momento)
  }

  class Aula {
    +AulaId id
  }

  class Turma {
    +TurmaId id
  }

  class Professor {
    +ProfessorId id
  }

  class Aluno {
    +AlunoId id
  }

  Chamada *-- RegistroDePresenca
  Chamada --> CodigoChamada
  Chamada --> JanelaResposta
  Chamada --> Aula : por Id
  Chamada --> Turma : por Id
  Chamada --> Professor : por Id
  Chamada --> Aluno : por Id
  Pessoa <|-- Aluno
  Pessoa <|-- Professor
```

## Checklist de Aceitação

- [x] VOs imutáveis e com igualdade por valor.
- [x] Domínio rico com operações de negócio em métodos.
- [x] Aggregate Root definida.
- [x] Repositório expõe apenas a Aggregate Root.
- [x] Eventos de domínio definidos.
- [x] Invariantes protegidas dentro do domínio.
- [x] Diagrama incluído.
