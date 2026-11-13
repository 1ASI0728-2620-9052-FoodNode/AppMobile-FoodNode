import { MessageDto } from './MessageDto.js';

export class GetConversationMessagesQueryHandler {
  /**
   * @param {import('../domain/ILiaChatRepository.js').ILiaChatRepository} repository
   */
  constructor(repository) {
    this._repository = repository;
  }

  /**
   * @param {{ conversationId: string }} query
   * @returns {Promise<import('./MessageDto.js').MessageDto[]>}
   */
  async execute({ conversationId }) {
    const rawMessages = await this._repository.getMessages(conversationId);
    return rawMessages.map(MessageDto.fromRaw);
  }
}

