import { ValueObject } from '../../../shared/kernel/ValueObject.js';
import { DomainError } from '../../../shared/kernel/DomainError.js';

export const Senders = Object.freeze({
  EXPLORER: 'EXPLORER',
  LIA: 'LIA',
});

export class MessageSender extends ValueObject {
  constructor(value) {
    super();
    this.value = value;
    Object.freeze(this);
  }

  static create(value) {
    if (!Object.values(Senders).includes(value)) {
      throw new DomainError(`Invalid sender: ${value}`, 'INVALID_SENDER');
    }
    return new MessageSender(value);
  }

  isLia() {
    return this.value === Senders.LIA;
  }

  isExplorer() {
    return this.value === Senders.EXPLORER;
  }

  toString() {
    return this.value;
  }
}

