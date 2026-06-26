export interface DomainEvent {
  readonly name: string;
  readonly occurredAt: Date;
  readonly [key: string]: unknown;
}
