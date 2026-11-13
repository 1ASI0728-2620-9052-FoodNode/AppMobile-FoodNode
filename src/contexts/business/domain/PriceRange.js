import { ValueObject } from '../../../shared/kernel/ValueObject.js';
import { DomainError } from '../../../shared/kernel/DomainError.js';

export class PriceRange extends ValueObject {
  constructor(min, max, label) {
    super();
    this.min = min;
    this.max = max;
    this.label = label;
    Object.freeze(this);
  }

  static create({ min, max, label }) {
    if (typeof min !== 'number' || typeof max !== 'number') {
      throw new DomainError('min and max must be numbers', 'INVALID_PRICE_RANGE');
    }
    if (min > max) {
      throw new DomainError('min must be <= max', 'INVALID_PRICE_RANGE');
    }
    return new PriceRange(min, max, label ?? `S/ ${min} - ${max}`);
  }

  toString() {
    return this.label;
  }
}
