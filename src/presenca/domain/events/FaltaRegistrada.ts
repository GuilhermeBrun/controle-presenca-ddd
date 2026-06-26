import { DomainEvent } from "../../../shared/domain/DomainEvent.js";

export interface FaltaRegistrada extends DomainEvent {
  readonly name: "FaltaRegistrada";
  readonly chamadaId: string;
  readonly alunoId: string;
  readonly registradoEm: Date;
}
