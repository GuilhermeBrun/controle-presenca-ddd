import { EntityId } from "../../../shared/domain/EntityId.js";

export class ProfessorId extends EntityId {
  private constructor(value: string) {
    super(value);
  }

  static create(value: string): ProfessorId {
    return new ProfessorId(this.normalize(value));
  }

  static generate(): ProfessorId {
    return new ProfessorId(this.generateValue("professor"));
  }
}
