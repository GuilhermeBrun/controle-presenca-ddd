import { DomainError } from "../../../shared/domain/DomainError.js";

export class EmailInstitucional {
  private constructor(public readonly value: string) {}

  static create(value: string): EmailInstitucional {
    const normalized = value.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      throw new DomainError("Email institucional invalido.");
    }

    return new EmailInstitucional(normalized);
  }

  equals(other: EmailInstitucional): boolean {
    return this.value === other.value;
  }
}
