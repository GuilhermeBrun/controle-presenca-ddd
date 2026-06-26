import { DomainError } from "./DomainError.js";

export abstract class EntityId {
  protected constructor(public readonly value: string) {}

  protected static normalize(value: string): string {
    const normalized = value.trim();

    if (normalized.length < 3) {
      throw new DomainError("Identificador deve possuir pelo menos 3 caracteres.");
    }

    return normalized;
  }

  protected static generateValue(prefix = "id"): string {
    const random = Math.random().toString(36).slice(2, 10);
    return `${prefix}_${Date.now().toString(36)}_${random}`;
  }

  equals(other: EntityId): boolean {
    return this.value === other.value;
  }
}
