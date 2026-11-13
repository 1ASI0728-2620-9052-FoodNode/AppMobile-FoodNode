import { MessageDto } from './MessageDto.js';

export class ConversationDto {
  static fromDomain(conversation) {
    return {
      id: conversation.id,
      status: conversation.status,
      messages: conversation.messages.map(MessageDto.fromDomain),
    };
  }

  static fromRaw(raw) {
    return {
      id: raw.id,
      status: raw.status || 'active',
      messages: (raw.messages || []).map(MessageDto.fromRaw),
    };
  }
}

