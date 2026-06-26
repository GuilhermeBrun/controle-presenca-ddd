import { EntityId } from "../../../shared/domain/EntityId.js";

export class TurmaId extends EntityId {
  private constructor(value: string) {
    super(value);
  }

  static create(value: string): TurmaId {
    return new TurmaId(this.normalize(value));
  }

  static generate(): TurmaId {
    return new TurmaId(this.generateValue("turma"));
  }
}
