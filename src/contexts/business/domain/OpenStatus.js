import { ValueObject } from '../../../shared/kernel/ValueObject.js';
import { DomainError } from '../../../shared/kernel/DomainError.js';

export class OpenStatus extends ValueObject {
  static OPEN = 'OPEN';
  static CLOSED = 'CLOSED';
  static CLOSING_SOON = 'CLOSING_SOON';

  static VALID = [OpenStatus.OPEN, OpenStatus.CLOSED, OpenStatus.CLOSING_SOON];

  constructor(status, message) {
    super();
    this.status = status;
    this.message = message ?? '';
    Object.freeze(this);
  }

  static create(status, message) {
    if (!OpenStatus.VALID.includes(status)) {
      throw new DomainError(
        `Invalid open status: ${status}`,
        'INVALID_OPEN_STATUS'
      );
    }
    return new OpenStatus(status, message);
  }

  isOpen() {
    return this.status === OpenStatus.OPEN;
  }

  isClosed() {
    return this.status === OpenStatus.CLOSED;
  }

  isClosingSoon() {
    return this.status === OpenStatus.CLOSING_SOON;
  }
}
