import { ILiaChatRepository } from '../domain/ILiaChatRepository.js';
import { httpClient } from '../../../shared/infrastructure/httpClient.js';
import { selectMyConversation } from './conversationSelector.js';

export class HttpLiaChatRepository extends ILiaChatRepository {
  async sendMessage(content, coordinates = null, conversationId = null) {
    // El backend espera latitude/longitude sueltos, no un objeto coordinates.
    const body = { content };
    if (conversationId) {
      body.conversationId = conversationId;
    }
    if (coordinates) {
      body.latitude = coordinates.latitude;
      body.longitude = coordinates.longitude;
    }

    // 202 { conversationId, messageId, status: "PROCESSING" }
    const response = await httpClient.post('/messaging/chat', body);
    return {
      conversationId: response.data.conversationId,
      messageId: response.data.messageId,
    };
  }

  async getMyConversation() {
    const response = await httpClient.get('/messaging/conversations/me');
    return selectMyConversation(response.data);
  }

  async getMessages(conversationId) {
    const response = await httpClient.get(`/messaging/conversations/${conversationId}/messages`);
    return response.data;
  }
}
