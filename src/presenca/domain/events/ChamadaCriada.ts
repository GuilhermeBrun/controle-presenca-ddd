import { DomainEvent } from "../../../shared/domain/DomainEvent.js";

export interface ChamadaCriada extends DomainEvent {
  readonly name: "ChamadaCriada";
  readonly chamadaId: string;
  readonly aulaId: string;
  readonly turmaId: string;
}
