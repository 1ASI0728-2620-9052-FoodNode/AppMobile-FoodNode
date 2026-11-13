import { ValueObject } from '../../../shared/kernel/ValueObject.js';
import { DomainError } from '../../../shared/kernel/DomainError.js';

export class Comment extends ValueObject {
  constructor(text) {
    super();
    this.text = text;
    Object.freeze(this);
  }

  static create(text) {
    if (!text || typeof text !== 'string' || text.trim().length < 20) {
      throw new DomainError(
        'El testimonio debe tener al menos 20 caracteres',
        'INVALID_COMMENT'
      );
    }
    return new Comment(text.trim());
  }
}
