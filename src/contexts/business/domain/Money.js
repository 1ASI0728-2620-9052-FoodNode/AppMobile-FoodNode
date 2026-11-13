import { ValueObject } from '../../../shared/kernel/ValueObject.js';
import { DomainError } from '../../../shared/kernel/DomainError.js';

export class Money extends ValueObject {
  constructor(amount, currency = 'PEN') {
    super();
    this.amount = amount;
    this.currency = currency;
    Object.freeze(this);
  }

  format() {
    return `S/ ${this.amount}`;
  }

  static create(amount, currency = 'PEN') {
    if (typeof amount !== 'number' || amount < 0) {
      throw new DomainError('Amount must be a non-negative number', 'INVALID_AMOUNT');
    }
    return new Money(amount, currency);
  }
}
