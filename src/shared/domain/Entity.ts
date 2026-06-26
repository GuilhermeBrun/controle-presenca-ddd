import { EntityId } from "./EntityId.js";

export abstract class Entity<TId extends EntityId> {
  protected constructor(public readonly id: TId) {}

  equals(other: Entity<TId>): boolean {
    return this.id.equals(other.id);
  }
}
