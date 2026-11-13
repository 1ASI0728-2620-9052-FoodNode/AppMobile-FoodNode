import { ValueObject } from '../../../shared/kernel/ValueObject.js';
import { DomainError } from '../../../shared/kernel/DomainError.js';

export class Rating extends ValueObject {
  constructor(value) {
    super();
    this.value = value;
    Object.freeze(this);
  }

  static create(value) {
    const num = Number(value);
    if (!Number.isInteger(num) || num < 1 || num > 5) {
      throw new DomainError('La calificación debe ser entre 1 y 5', 'INVALID_RATING');
    }
    return new Rating(num);
  }
}
