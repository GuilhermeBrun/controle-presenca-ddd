import { DomainEvent } from "./DomainEvent.js";

export abstract class AggregateRoot {
  private readonly events: DomainEvent[] = [];

  protected addEvent(event: DomainEvent): void {
    this.events.push(event);
  }

  pullEvents(): DomainEvent[] {
    return this.events.splice(0);
  }
}
