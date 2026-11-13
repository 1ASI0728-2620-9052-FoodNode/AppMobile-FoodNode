import { ValueObject } from '../../../shared/kernel/ValueObject.js';
import { DomainError } from '../../../shared/kernel/DomainError.js';

const MIN_LENGTH = 8;

export class Password extends ValueObject {
  constructor(value) {
    super();
    this.value = value;
  }

  static create(value) {
    if (!value || typeof value !== 'string') {
      throw new DomainError('La contraseña es requerida', 'INVALID_PASSWORD');
    }
    if (value.length < MIN_LENGTH) {
      throw new DomainError(
        'La contraseña debe tener al menos 8 caracteres',
        'INVALID_PASSWORD',
      );
    }
    const instance = new Password(value);
    return Object.freeze(instance);
  }

  toString() {
    return '********';
  }
}
