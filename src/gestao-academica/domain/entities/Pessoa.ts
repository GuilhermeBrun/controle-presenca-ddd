import { Entity } from "../../../shared/domain/Entity.js";
import { EntityId } from "../../../shared/domain/EntityId.js";
import { EmailInstitucional } from "../value-objects/EmailInstitucional.js";
import { NomePessoa } from "../value-objects/NomePessoa.js";

export abstract class Pessoa<TId extends EntityId> extends Entity<TId> {
  protected constructor(
    id: TId,
    public readonly nome: NomePessoa,
    public readonly email: EmailInstitucional,
  ) {
    super(id);
  }
}
