import { AlunoId } from "../value-objects/AlunoId.js";
import { TipoRegistroPresenca } from "../TipoRegistroPresenca.js";

export class RegistroDePresenca {
  private constructor(
    public readonly alunoId: AlunoId,
    public readonly tipo: TipoRegistroPresenca,
    public readonly registradoEm: Date,
  ) {}

  static presente(alunoId: AlunoId, registradoEm: Date): RegistroDePresenca {
    return new RegistroDePresenca(alunoId, TipoRegistroPresenca.Presente, new Date(registradoEm));
  }

  static falta(alunoId: AlunoId, registradoEm: Date): RegistroDePresenca {
    return new RegistroDePresenca(alunoId, TipoRegistroPresenca.Falta, new Date(registradoEm));
  }

  isPresente(): boolean {
    return this.tipo === TipoRegistroPresenca.Presente;
  }
}
