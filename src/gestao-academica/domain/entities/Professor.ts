import { ProfessorId } from "../../../presenca/domain/value-objects/ProfessorId.js";
import { EmailInstitucional } from "../value-objects/EmailInstitucional.js";
import { NomePessoa } from "../value-objects/NomePessoa.js";
import { Pessoa } from "./Pessoa.js";

export class Professor extends Pessoa<ProfessorId> {
  private constructor(
    id: ProfessorId,
    nome: NomePessoa,
    email: EmailInstitucional,
    public readonly registroDocente: string,
  ) {
    super(id, nome, email);
  }

  static criar(params: {
    nome: NomePessoa;
    email: EmailInstitucional;
    registroDocente: string;
  }): Professor {
    return new Professor(
      ProfessorId.generate(),
      params.nome,
      params.email,
      params.registroDocente.trim(),
    );
  }
}
