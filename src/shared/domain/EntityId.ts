import { DomainError } from "./DomainError.js";

export class EntityId {
  private constructor(public readonly value: string) {}

  static create(value: string): EntityId {
    const normalized = value.trim();

    if (normalized.length < 3) {
      throw new DomainError("Identificador deve possuir pelo menos 3 caracteres.");
    }

    return new EntityId(normalized);
  }

  static generate(prefix = "id"): EntityId {
    const random = Math.random().toString(36).slice(2, 10);
    return new EntityId(`${prefix}_${Date.now().toString(36)}_${random}`);
  }

  equals(other: EntityId): boolean {
    return this.value === other.value;
  }
}
