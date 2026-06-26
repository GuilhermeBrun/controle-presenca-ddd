import { EntityId } from "../../../shared/domain/EntityId.js";

export class ChamadaId extends EntityId {
  private constructor(value: string) {
    super(value);
  }

  static create(value: string): ChamadaId {
    return new ChamadaId(this.normalize(value));
  }

  static generate(): ChamadaId {
    return new ChamadaId(this.generateValue("chamada"));
  }
}
