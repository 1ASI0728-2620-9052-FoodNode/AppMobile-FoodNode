import { Entity } from '../../../shared/kernel/Entity.js';
import { DomainError } from '../../../shared/kernel/DomainError.js';

export class Message extends Entity {
  constructor({ id, sender, content, detectedIntent, reservationRef, sentAt }) {
    super(id);
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      throw new DomainError('El contenido del mensaje no puede estar vacío', 'EMPTY_MESSAGE');
    }
    this.sender = sender;
    this.content = content.trim();
    this.detectedIntent = detectedIntent || null;
    this.reservationRef = reservationRef || null;
    this.sentAt = sentAt instanceof Date ? sentAt : new Date(sentAt || Date.now());
  }

  static create({ id, sender, content, detectedIntent = null, reservationRef = null, sentAt = null }) {
    return new Message({ id, sender, content, detectedIntent, reservationRef, sentAt: sentAt || new Date() });
  }
}

