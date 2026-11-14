import { DomainError } from '../../../shared/kernel/DomainError.js';

export class SendMessageToLiaCommandHandler {
  /**
   * @param {import('../domain/ILiaChatRepository.js').ILiaChatRepository} repository
   */
  constructor(repository) {
    this._repository = repository;
  }

  /**
   * @param {{
   *   content: string,
   *   coordinates?: { latitude: number, longitude: number } | null,
   *   conversationId?: string | null,
   * }} command
   * @returns {Promise<{ conversationId: string, messageId: string }>}
   */
  async execute({ content, coordinates = null, conversationId = null }) {
    if (!content || content.trim().length === 0) {
      throw new DomainError('El mensaje no puede estar vacío', 'EMPTY_MESSAGE');
    }
    const { conversationId: id, messageId } = await this._repository.sendMessage(
      content.trim(),
      coordinates,
      conversationId,
    );
    return { conversationId: id, messageId };
  }
}
