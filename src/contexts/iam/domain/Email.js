import { ValueObject } from '../../../shared/kernel/ValueObject.js';
import { DomainError } from '../../../shared/kernel/DomainError.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class Email extends ValueObject {
  constructor(value) {
    super();
    this.value = value;
  }

  static create(value) {
    if (!value || typeof value !== 'string') {
      throw new DomainError('El correo electrónico es requerido', 'INVALID_EMAIL');
    }
    const trimmed = value.trim().toLowerCase();
    if (!EMAIL_REGEX.test(trimmed)) {
      throw new DomainError('Correo electrónico inválido', 'INVALID_EMAIL');
    }
    const instance = new Email(trimmed);
    return Object.freeze(instance);
  }

  toString() {
    return this.value;
  }
}
