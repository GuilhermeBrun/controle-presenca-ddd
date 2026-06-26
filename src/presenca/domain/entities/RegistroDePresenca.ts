import { Entity } from "../../../shared/domain/Entity.js";
import { AlunoId } from "../value-objects/AlunoId.js";
import { RegistroDePresencaId } from "../value-objects/RegistroDePresencaId.js";
import { TipoRegistroPresenca } from "../TipoRegistroPresenca.js";

export class RegistroDePresenca extends Entity<RegistroDePresencaId> {
  private constructor(
    id: RegistroDePresencaId,
    public readonly alunoId: AlunoId,
    public readonly tipo: TipoRegistroPresenca,
    public readonly registradoEm: Date,
  ) {
    super(id);
  }

  static presente(alunoId: AlunoId, registradoEm: Date): RegistroDePresenca {
    return new RegistroDePresenca(
      RegistroDePresencaId.generate(),
      alunoId,
      TipoRegistroPresenca.Presente,
      new Date(registradoEm),
    );
  }

  static falta(alunoId: AlunoId, registradoEm: Date): RegistroDePresenca {
    return new RegistroDePresenca(
      RegistroDePresencaId.generate(),
      alunoId,
      TipoRegistroPresenca.Falta,
      new Date(registradoEm),
    );
  }

  isPresente(): boolean {
    return this.tipo === TipoRegistroPresenca.Presente;
  }
}
