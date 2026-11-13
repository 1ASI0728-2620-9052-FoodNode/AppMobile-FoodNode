import { ValueObject } from '../../../shared/kernel/ValueObject.js';
import { DomainError } from '../../../shared/kernel/DomainError.js';

export class CuisineType extends ValueObject {
  static VALID = ['CEVICHERIA', 'CRIOLLO', 'MARINO', 'CHIFA', 'TRADICIONAL'];

  constructor(value) {
    super();
    this.value = value;
    Object.freeze(this);
  }

  static create(value) {
    if (!CuisineType.VALID.includes(value)) {
      throw new DomainError(
        `Invalid cuisine type: ${value}. Must be one of ${CuisineType.VALID.join(', ')}`,
        'INVALID_CUISINE_TYPE'
      );
    }
    return new CuisineType(value);
  }

  toString() {
    return this.value;
  }
}
