import { DomainError } from "../../../shared/domain/DomainError.js";

export class CodigoChamada {
  private constructor(public readonly value: string) {}

  static create(value: string): CodigoChamada {
    const normalized = value.trim().toUpperCase();

    if (!/^[A-Z0-9]{6}$/.test(normalized)) {
      throw new DomainError("Codigo da chamada deve possuir 6 caracteres alfanumericos.");
    }

    return new CodigoChamada(normalized);
  }

  static generate(): CodigoChamada {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";

    for (let i = 0; i < 6; i += 1) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }

    return new CodigoChamada(code);
  }

  equals(other: CodigoChamada): boolean {
    return this.value === other.value;
  }
}
