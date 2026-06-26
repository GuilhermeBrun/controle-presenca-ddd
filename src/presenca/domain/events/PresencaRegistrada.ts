import { DomainEvent } from "../../../shared/domain/DomainEvent.js";

export interface PresencaRegistrada extends DomainEvent {
  readonly name: "PresencaRegistrada";
  readonly chamadaId: string;
  readonly alunoId: string;
  readonly registradoEm: Date;
}
