import { ValueObject } from '../../../shared/kernel/ValueObject.js';
import { DomainError } from '../../../shared/kernel/DomainError.js';

const H3_HEX_RE = /^[0-9a-fA-F]{15}$/;

export class H3Cell extends ValueObject {
  constructor(index, resolution) {
    super();
    if (!index || !H3_HEX_RE.test(index)) {
      throw new DomainError('Invalid H3 index format', 'INVALID_H3_INDEX');
    }
    this.index = index;
    this.resolution = resolution ?? 8;
    Object.freeze(this);
  }

  static create(index, resolution) {
    return new H3Cell(index, resolution);
  }

  toString() {
    return this.index;
  }
}
