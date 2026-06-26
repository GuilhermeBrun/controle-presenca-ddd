import { Chamada } from "./presenca/domain/Chamada.js";
import { InMemoryChamadaRepository } from "./presenca/infrastructure/InMemoryChamadaRepository.js";
import { AlunoId } from "./presenca/domain/value-objects/AlunoId.js";
import { AulaId } from "./presenca/domain/value-objects/AulaId.js";
import { CodigoChamada } from "./presenca/domain/value-objects/CodigoChamada.js";
import { JanelaResposta } from "./presenca/domain/value-objects/JanelaResposta.js";
import { ProfessorId } from "./presenca/domain/value-objects/ProfessorId.js";
import { TurmaId } from "./presenca/domain/value-objects/TurmaId.js";

async function main(): Promise<void> {
  const repository = new InMemoryChamadaRepository();
  const agora = new Date();
  const fim = new Date(agora.getTime() + 10 * 60 * 1000);
  const codigo = CodigoChamada.create("ABC123");

  const chamada = Chamada.criar({
    aulaId: AulaId.create("aula-001"),
    turmaId: TurmaId.create("turma-ads-3"),
    professorId: ProfessorId.create("prof-001"),
    alunosEsperados: [
      AlunoId.create("aluno-001"),
      AlunoId.create("aluno-002"),
      AlunoId.create("aluno-003"),
    ],
  });

  chamada.iniciar(JanelaResposta.create(agora, fim), codigo);
  chamada.registrarPresenca(AlunoId.create("aluno-001"), codigo, new Date(agora.getTime() + 1000));
  chamada.registrarPresenca(AlunoId.create("aluno-002"), codigo, new Date(agora.getTime() + 2000));
  chamada.encerrar(fim);

  await repository.adicionar(chamada);

  console.log({
    chamadaId: chamada.id.value,
    status: chamada.status,
    registros: chamada.registros.map((registro) => ({
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
