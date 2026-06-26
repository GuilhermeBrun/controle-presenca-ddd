import { EntityId } from "../../../shared/domain/EntityId.js";

export class AulaId extends EntityId {
  private constructor(value: string) {
    super(value);
  }

  static create(value: string): AulaId {
    return new AulaId(this.normalize(value));
  }

  static generate(): AulaId {
    return new AulaId(this.generateValue("aula"));
  }
}
