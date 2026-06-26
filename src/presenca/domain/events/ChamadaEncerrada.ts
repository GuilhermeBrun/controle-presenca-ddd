import { DomainEvent } from "../../../shared/domain/DomainEvent.js";

export interface ChamadaEncerrada extends DomainEvent {
  readonly name: "ChamadaEncerrada";
  readonly chamadaId: string;
  readonly totalPresentes: number;
  readonly totalFaltas: number;
}
