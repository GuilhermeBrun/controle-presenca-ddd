import { DomainError } from "../../../shared/domain/DomainError.js";

export class NomePessoa {
  private constructor(public readonly value: string) {}

  static create(value: string): NomePessoa {
    const normalized = value.trim();

    if (normalized.length < 3) {
      throw new DomainError("Nome da pessoa deve possuir pelo menos 3 caracteres.");
    }

    return new NomePessoa(normalized);
  }

  equals(other: NomePessoa): boolean {
    return this.value === other.value;
  }
}
