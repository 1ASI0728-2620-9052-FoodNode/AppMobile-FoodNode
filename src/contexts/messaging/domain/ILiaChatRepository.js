export class ILiaChatRepository {
  /**
   * Envía un mensaje a Lía. La respuesta llega de forma asíncrona (se obtiene
   * con polling a getMessages).
   * @param {string} content
   * @param {{ latitude: number, longitude: number } | null} coordinates
   * @param {string | null} conversationId  null en el primer mensaje: el backend crea la conversación.
   * @returns {Promise<{ conversationId: string, messageId: string }>}
   */
  async sendMessage(_content, _coordinates, _conversationId) {
    throw new Error('ILiaChatRepository.sendMessage not implemented');
  }

  /**
   * @returns {Promise<{ id: string, status: string, messages?: any[] } | null>}
   *   La conversación activa del usuario, o null si todavía no tiene ninguna.
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
