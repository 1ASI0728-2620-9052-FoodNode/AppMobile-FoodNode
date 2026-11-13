import { DomainError } from '../../../shared/kernel/DomainError.js';

export class SendMessageToLiaCommandHandler {
  /**
   * @param {import('../domain/ILiaChatRepository.js').ILiaChatRepository} repository
   */
  constructor(repository) {
    this._repository = repository;
  }

  /**
   * @param {{ content: string, coordinates?: { latitude: number, longitude: number } | null }} command
   */
  async execute({ content, coordinates = null }) {
    if (!content || content.trim().length === 0) {
      throw new DomainError('El mensaje no puede estar vacío', 'EMPTY_MESSAGE');
    }
    await this._repository.sendMessage(content.trim(), coordinates);
  }
}

