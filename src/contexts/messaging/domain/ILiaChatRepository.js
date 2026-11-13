export class ILiaChatRepository {
  /**
   * @param {string} content
   * @param {{ latitude: number, longitude: number } | null} coordinates
   * @returns {Promise<void>}
   */
  async sendMessage(_content, _coordinates) {
    throw new Error('ILiaChatRepository.sendMessage not implemented');
  }

  /**
   * @returns {Promise<{ id: string, status: string, messages: any[] }>}
   */
  async getMyConversation() {
    throw new Error('ILiaChatRepository.getMyConversation not implemented');
  }

  /**
   * @param {string} conversationId
   * @returns {Promise<any[]>}
   */
  async getMessages(_conversationId) {
    throw new Error('ILiaChatRepository.getMessages not implemented');
  }
}

