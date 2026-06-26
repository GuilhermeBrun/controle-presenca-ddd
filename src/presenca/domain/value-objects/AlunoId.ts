import { EntityId } from "../../../shared/domain/EntityId.js";

export class AlunoId extends EntityId {
  private constructor(value: string) {
    super(value);
  }

  static create(value: string): AlunoId {
    return new AlunoId(this.normalize(value));
  }

  static generate(): AlunoId {
    return new AlunoId(this.generateValue("aluno"));
  }
}
