import { MessageDto } from './MessageDto.js';
import { Senders } from '../domain/MessageSender.js';

const POLL_INTERVAL_MS = 2000;
const MAX_POLL_MS = 30000;

export class LiaResponsePoller {
  /**
   * @param {import('../domain/ILiaChatRepository.js').ILiaChatRepository} repository
   */
  constructor(repository) {
    this._repository = repository;
  }

  /**
   * Polls until a new Lía message appears after the given snapshot count.
   * @param {string} conversationId
   * @param {number} previousMessageCount
   * @returns {Promise<import('./MessageDto.js').MessageDto | null>}
   */
  async pollForLiaResponse(conversationId, previousMessageCount) {
    const deadline = Date.now() + MAX_POLL_MS;

    while (Date.now() < deadline) {
      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
      const messages = await this._repository.getMessages(conversationId);
      const liaMessages = messages.filter((m) => (m.sender || m.sender?.value) === Senders.LIA);
      if (liaMessages.length > previousMessageCount) {
        const newest = liaMessages[liaMessages.length - 1];
        return MessageDto.fromRaw(newest);
      }
    }
    return null;
  }
}

