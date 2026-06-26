import { EntityId } from "../../../shared/domain/EntityId.js";

export class RegistroDePresencaId extends EntityId {
  private constructor(value: string) {
    super(value);
  }

  static create(value: string): RegistroDePresencaId {
    return new RegistroDePresencaId(this.normalize(value));
  }

  static generate(): RegistroDePresencaId {
    return new RegistroDePresencaId(this.generateValue("registro-presenca"));
  }
}
