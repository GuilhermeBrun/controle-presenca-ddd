import { DomainEvent } from "../../../shared/domain/DomainEvent.js";

export interface ChamadaIniciada extends DomainEvent {
  readonly name: "ChamadaIniciada";
  readonly chamadaId: string;
  readonly codigo: string;
  readonly inicio: Date;
  readonly fim: Date;
}
