import { Aluno } from "./gestao-academica/domain/entities/Aluno.js";
import { Professor } from "./gestao-academica/domain/entities/Professor.js";
import { EmailInstitucional } from "./gestao-academica/domain/value-objects/EmailInstitucional.js";
import { NomePessoa } from "./gestao-academica/domain/value-objects/NomePessoa.js";
import { Chamada } from "./presenca/domain/Chamada.js";
import { InMemoryChamadaRepository } from "./presenca/infrastructure/InMemoryChamadaRepository.js";
import { AulaId } from "./presenca/domain/value-objects/AulaId.js";
import { CodigoChamada } from "./presenca/domain/value-objects/CodigoChamada.js";
import { JanelaResposta } from "./presenca/domain/value-objects/JanelaResposta.js";
import { TurmaId } from "./presenca/domain/value-objects/TurmaId.js";

async function main(): Promise<void> {
  const repository = new InMemoryChamadaRepository();
  const agora = new Date();
  const fim = new Date(agora.getTime() + 10 * 60 * 1000);
  const codigo = CodigoChamada.create("ABC123");
  const professor = Professor.criar({
    nome: NomePessoa.create("Ana Professora"),
    email: EmailInstitucional.create("ana.professora@fiap.com.br"),
    registroDocente: "DOC-001",
  });
  const aluno1 = Aluno.criar({
    nome: NomePessoa.create("Aluno Um"),
    email: EmailInstitucional.create("aluno.um@fiap.com.br"),
    matricula: "RM001",
  });
  const aluno2 = Aluno.criar({
    nome: NomePessoa.create("Aluno Dois"),
    email: EmailInstitucional.create("aluno.dois@fiap.com.br"),
    matricula: "RM002",
  });
  const aluno3 = Aluno.criar({
    nome: NomePessoa.create("Aluno Tres"),
    email: EmailInstitucional.create("aluno.tres@fiap.com.br"),
    matricula: "RM003",
  });

  const chamada = Chamada.criar({
    aulaId: AulaId.create("aula-001"),
    turmaId: TurmaId.create("turma-ads-3"),
    professorId: professor.id,
    alunosEsperados: [aluno1.id, aluno2.id, aluno3.id],
  });

  chamada.iniciar(JanelaResposta.create(agora, fim), codigo);
  chamada.registrarPresenca(aluno1.id, codigo, new Date(agora.getTime() + 1000));
  chamada.registrarPresenca(aluno2.id, codigo, new Date(agora.getTime() + 2000));
  chamada.encerrar(fim);

  await repository.adicionar(chamada);

  console.log({
    chamadaId: chamada.id.value,
    status: chamada.status,
    registros: chamada.registros.map((registro) => ({
      registroId: registro.id.value,
      alunoId: registro.alunoId.value,
      tipo: registro.tipo,
      registradoEm: registro.registradoEm.toISOString(),
    })),
    eventos: chamada.pullEvents().map((event) => event.name),
  });
}

main().catch((error: unknown) => {
  console.error(error);
});
