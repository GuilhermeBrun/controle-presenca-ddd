import { AggregateRoot } from "../../shared/domain/AggregateRoot.js";
import { DomainError } from "../../shared/domain/DomainError.js";
import { RegistroDePresenca } from "./entities/RegistroDePresenca.js";
import { StatusChamada } from "./StatusChamada.js";
import { TipoRegistroPresenca } from "./TipoRegistroPresenca.js";
import { AlunoId } from "./value-objects/AlunoId.js";
import { AulaId } from "./value-objects/AulaId.js";
import { ChamadaId } from "./value-objects/ChamadaId.js";
import { CodigoChamada } from "./value-objects/CodigoChamada.js";
import { JanelaResposta } from "./value-objects/JanelaResposta.js";
import { ProfessorId } from "./value-objects/ProfessorId.js";
import { TurmaId } from "./value-objects/TurmaId.js";

type ChamadaProps = {
  aulaId: AulaId;
  turmaId: TurmaId;
  professorId: ProfessorId;
  alunosEsperados: AlunoId[];
  status: StatusChamada;
  codigo?: CodigoChamada;
  janelaResposta?: JanelaResposta;
  registros: RegistroDePresenca[];
};

export class Chamada extends AggregateRoot<ChamadaId> {
  private constructor(id: ChamadaId, private readonly props: ChamadaProps) {
    super(id);
  }

  static criar(params: {
    aulaId: AulaId;
    turmaId: TurmaId;
    professorId: ProfessorId;
    alunosEsperados: AlunoId[];
  }): Chamada {
    if (params.alunosEsperados.length === 0) {
      throw new DomainError("Chamada deve possuir pelo menos um aluno esperado.");
    }

    const chamada = new Chamada(
      ChamadaId.generate(),
      {
        aulaId: params.aulaId,
        turmaId: params.turmaId,
        professorId: params.professorId,
        alunosEsperados: [...params.alunosEsperados],
        status: StatusChamada.Planejada,
        registros: [],
      },
    );

    chamada.addEvent({
      name: "ChamadaCriada",
      occurredAt: new Date(),
      chamadaId: chamada.id.value,
      aulaId: chamada.aulaId.value,
      turmaId: chamada.turmaId.value,
    });

    return chamada;
  }

  get aulaId(): AulaId {
    return this.props.aulaId;
  }

  get turmaId(): TurmaId {
    return this.props.turmaId;
  }

  get status(): StatusChamada {
    return this.props.status;
  }

  get codigo(): CodigoChamada | undefined {
    return this.props.codigo;
  }

  get registros(): readonly RegistroDePresenca[] {
    return [...this.props.registros];
  }

  iniciar(janelaResposta: JanelaResposta, codigo = CodigoChamada.generate()): void {
    if (this.props.status !== StatusChamada.Planejada) {
      throw new DomainError("Somente chamadas planejadas podem ser iniciadas.");
    }

    this.props.status = StatusChamada.Aberta;
    this.props.codigo = codigo;
    this.props.janelaResposta = janelaResposta;

    this.addEvent({
      name: "ChamadaIniciada",
      occurredAt: new Date(),
      chamadaId: this.id.value,
      codigo: codigo.value,
      inicio: janelaResposta.inicio,
      fim: janelaResposta.fim,
    });
  }

  registrarPresenca(alunoId: AlunoId, codigoInformado: CodigoChamada, momento: Date): void {
    if (this.props.status !== StatusChamada.Aberta) {
      throw new DomainError("Presenca so pode ser registrada em chamada aberta.");
    }

    if (!this.props.codigo?.equals(codigoInformado)) {
      throw new DomainError("Codigo informado nao corresponde ao codigo da chamada.");
    }

    if (!this.props.janelaResposta?.contem(momento)) {
      throw new DomainError("Momento informado esta fora da janela de resposta.");
    }

    if (!this.alunoPertenceATurma(alunoId)) {
      throw new DomainError("Aluno nao pertence a turma desta chamada.");
    }

    if (this.jaExisteRegistro(alunoId)) {
      throw new DomainError("Aluno ja possui registro nesta chamada.");
    }

    this.props.registros.push(RegistroDePresenca.presente(alunoId, momento));

    this.addEvent({
      name: "PresencaRegistrada",
      occurredAt: new Date(),
      chamadaId: this.id.value,
      alunoId: alunoId.value,
      registradoEm: new Date(momento),
    });
  }

  encerrar(momento: Date): void {
    if (this.props.status !== StatusChamada.Aberta) {
      throw new DomainError("Somente chamadas abertas podem ser encerradas.");
    }

    for (const alunoId of this.props.alunosEsperados) {
      if (!this.jaExisteRegistro(alunoId)) {
        this.props.registros.push(RegistroDePresenca.falta(alunoId, momento));
        this.addEvent({
          name: "FaltaRegistrada",
          occurredAt: new Date(),
          chamadaId: this.id.value,
          alunoId: alunoId.value,
          registradoEm: new Date(momento),
        });
      }
    }

    this.props.status = StatusChamada.Encerrada;

    this.addEvent({
      name: "ChamadaEncerrada",
      occurredAt: new Date(),
      chamadaId: this.id.value,
      totalPresentes: this.totalPorTipo(TipoRegistroPresenca.Presente),
      totalFaltas: this.totalPorTipo(TipoRegistroPresenca.Falta),
    });
  }

  private alunoPertenceATurma(alunoId: AlunoId): boolean {
    return this.props.alunosEsperados.some((esperado) => esperado.equals(alunoId));
  }

  private jaExisteRegistro(alunoId: AlunoId): boolean {
    return this.props.registros.some((registro) => registro.alunoId.equals(alunoId));
  }

  private totalPorTipo(tipo: TipoRegistroPresenca): number {
    return this.props.registros.filter((registro) => registro.tipo === tipo).length;
  }
}
