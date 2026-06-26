import { AlunoId } from "../../../presenca/domain/value-objects/AlunoId.js";
import { EmailInstitucional } from "../value-objects/EmailInstitucional.js";
import { NomePessoa } from "../value-objects/NomePessoa.js";
import { Pessoa } from "./Pessoa.js";

export class Aluno extends Pessoa<AlunoId> {
  private constructor(
    id: AlunoId,
    nome: NomePessoa,
    email: EmailInstitucional,
    public readonly matricula: string,
  ) {
    super(id, nome, email);
  }

  static criar(params: {
    nome: NomePessoa;
    email: EmailInstitucional;
    matricula: string;
  }): Aluno {
    return new Aluno(
      AlunoId.generate(),
      params.nome,
      params.email,
      params.matricula.trim(),
    );
  }
}
