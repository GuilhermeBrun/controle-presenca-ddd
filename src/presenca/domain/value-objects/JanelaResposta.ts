import { DomainError } from "../../../shared/domain/DomainError.js";

export class JanelaResposta {
  private constructor(
    public readonly inicio: Date,
    public readonly fim: Date,
  ) {}

  static create(inicio: Date, fim: Date): JanelaResposta {
    if (fim <= inicio) {
      throw new DomainError("Fim da janela de resposta deve ser posterior ao inicio.");
    }

    return new JanelaResposta(new Date(inicio), new Date(fim));
  }

  contem(momento: Date): boolean {
    return momento >= this.inicio && momento <= this.fim;
  }

  equals(other: JanelaResposta): boolean {
    return this.inicio.getTime() === other.inicio.getTime()
      && this.fim.getTime() === other.fim.getTime();
  }
}
