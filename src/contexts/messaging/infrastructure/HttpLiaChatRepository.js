import { ILiaChatRepository } from '../domain/ILiaChatRepository.js';
import { httpClient } from '../../../shared/infrastructure/httpClient.js';

export class HttpLiaChatRepository extends ILiaChatRepository {
  async sendMessage(content, coordinates = null) {
    const body = { content };
    if (coordinates) {
      body.coordinates = coordinates;
    }
    await httpClient.post('/messaging/chat', body);
  }

  async getMyConversation() {
    const response = await httpClient.get('/messaging/conversations/me');
    return response.data;
  }

  async getMessages(conversationId) {
    const response = await httpClient.get(`/messaging/conversations/${conversationId}/messages`);
    return response.data;
  }
}

