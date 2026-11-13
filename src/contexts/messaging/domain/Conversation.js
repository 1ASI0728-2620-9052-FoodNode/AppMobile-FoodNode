import { AggregateRoot } from '../../../shared/kernel/AggregateRoot.js';

export class Conversation extends AggregateRoot {
  constructor({ id, status = 'active', messages = [] }) {
    super(id);
    this.status = status;
    this._messages = [...messages];
  }

  static create({ id, status = 'active', messages = [] }) {
    return new Conversation({ id, status, messages });
  }

  addMessage(message) {
    this._messages.push(message);
  }

  getLastMessages(n) {
    return this._messages.slice(-n);
  }

  get messages() {
    return [...this._messages];
  }

  get messageCount() {
    return this._messages.length;
  }
}

