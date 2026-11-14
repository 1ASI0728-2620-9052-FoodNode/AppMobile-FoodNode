import { ConversationDto } from './ConversationDto.js';

export class GetMyConversationQueryHandler {
  /**
   * @param {import('../domain/ILiaChatRepository.js').ILiaChatRepository} repository
   */
  constructor(repository) {
    this._repository = repository;
  }

  /**
   * @returns {Promise<{ id: string, status: string, messages: any[] } | null>}
   *   null si el usuario todavía no tiene conversación.
   */
  async execute() {
    const raw = await this._repository.getMyConversation();
    if (!raw) return null;
    return ConversationDto.fromRaw(raw);
  }
}
