import { Entity } from './Entity.js';
export class AggregateRoot extends Entity {
  constructor(id) {
    super(id);
    this._domainEvents = [];
  }
  addDomainEvent(event) {
    this._domainEvents.push(event);
  }
  clearDomainEvents() {
    const events = [...this._domainEvents];
    this._domainEvents = [];
    return events;
  }
  get domainEvents() {
    return [...this._domainEvents];
  }
}

