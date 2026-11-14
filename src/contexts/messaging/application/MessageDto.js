import { Senders } from '../domain/MessageSender.js';

export class MessageDto {
  static fromDomain(message) {
    return {
      id: message.id,
      sender: message.sender.value,
      content: message.content,
      detectedIntent: message.detectedIntent,
      reservationRef: message.reservationRef,
      sentAt: message.sentAt.toISOString(),
      isFromLia: message.sender.isLia(),
    };
  }

  /**
   * Mensaje del backend: { id, sender, content, intentType, huariqueId, reservationId, sentAt }.
   * También acepta las variantes snake_case / detectedIntent / reservationRef del mock.
   */
  static fromRaw(raw) {
    return {
      id: raw.id,
      sender: raw.sender,
      content: raw.content,
      detectedIntent: raw.intentType || raw.detected_intent || raw.detectedIntent || null,
      reservationRef: raw.reservationId || raw.reservation_ref || raw.reservationRef || null,
      sentAt: raw.sent_at || raw.sentAt || new Date().toISOString(),
      isFromLia: raw.sender === Senders.LIA,
    };
  }
}
