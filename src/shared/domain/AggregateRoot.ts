import { DomainEvent } from "./DomainEvent.js";
import { Entity } from "./Entity.js";
import { EntityId } from "./EntityId.js";

export abstract class AggregateRoot<TId extends EntityId> extends Entity<TId> {
  private readonly events: DomainEvent[] = [];

  protected constructor(id: TId) {
    super(id);
  }

  protected addEvent(event: DomainEvent): void {
    this.events.push(event);
  }

  pullEvents(): DomainEvent[] {
    return this.events.splice(0);
  }
}
