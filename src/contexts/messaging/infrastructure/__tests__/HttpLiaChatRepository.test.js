import { beforeEach, describe, expect, jest, test } from '@jest/globals';

jest.mock('../../../../shared/infrastructure/httpClient.js', () => ({
  httpClient: { post: jest.fn(), get: jest.fn() },
}));

import { httpClient } from '../../../../shared/infrastructure/httpClient.js';
import { HttpLiaChatRepository } from '../HttpLiaChatRepository.js';
import { selectMyConversation } from '../conversationSelector.js';

describe('HttpLiaChatRepository', () => {
  const repository = new HttpLiaChatRepository();

  beforeEach(() => {
    httpClient.post.mockReset();
    httpClient.get.mockReset();
  });

  test('sendMessage aplana coordinates a latitude/longitude y envía conversationId', async () => {
    httpClient.post.mockResolvedValue({ data: { conversationId: 'c1', messageId: 'm1', status: 'PROCESSING' } });

    const result = await repository.sendMessage('hola', { latitude: -12.14, longitude: -77.02 }, 'c1');

    expect(httpClient.post).toHaveBeenCalledWith('/messaging/chat', {
      content: 'hola',
      conversationId: 'c1',
      latitude: -12.14,
      longitude: -77.02,
    });
    expect(result).toEqual({ conversationId: 'c1', messageId: 'm1' });
  });

  test('sendMessage sin conversación ni ubicación solo envía content', async () => {
    httpClient.post.mockResolvedValue({ data: { conversationId: 'nueva', messageId: 'm1', status: 'PROCESSING' } });

    const result = await repository.sendMessage('hola');

    expect(httpClient.post).toHaveBeenCalledWith('/messaging/chat', { content: 'hola' });
    expect(result.conversationId).toBe('nueva');
  });

  test('getMyConversation devuelve null cuando la lista viene vacía', async () => {
    httpClient.get.mockResolvedValue({ data: [] });
    await expect(repository.getMyConversation()).resolves.toBeNull();
    expect(httpClient.get).toHaveBeenCalledWith('/messaging/conversations/me');
  });

  test('getMyConversation devuelve la conversación ACTIVE de la lista', async () => {
    httpClient.get.mockResolvedValue({ data: [{ id: 'vieja', status: 'CLOSED' }, { id: 'activa', status: 'ACTIVE' }] });
    await expect(repository.getMyConversation()).resolves.toEqual({ id: 'activa', status: 'ACTIVE' });
  });

  test('getMessages consulta los mensajes de la conversación', async () => {
    httpClient.get.mockResolvedValue({ data: [{ id: 'm1' }] });
    await expect(repository.getMessages('c1')).resolves.toEqual([{ id: 'm1' }]);
    expect(httpClient.get).toHaveBeenCalledWith('/messaging/conversations/c1/messages');
  });
});

describe('selectMyConversation', () => {
  test('null si no hay conversaciones o la respuesta no es una lista', () => {
    expect(selectMyConversation([])).toBeNull();
    expect(selectMyConversation(null)).toBeNull();
    expect(selectMyConversation({})).toBeNull();
  });

  test('entre varias ACTIVE elige la más reciente', () => {
    const list = [
      { id: 'a', status: 'ACTIVE', createdAt: '2026-11-01T00:00:00Z' },
      { id: 'b', status: 'ACTIVE', createdAt: '2026-11-10T00:00:00Z' },
      { id: 'c', status: 'CLOSED', createdAt: '2026-11-12T00:00:00Z' },
    ];
    expect(selectMyConversation(list).id).toBe('b');
  });

  test('sin ninguna ACTIVE elige la más reciente', () => {
    const list = [
      { id: 'a', status: 'CLOSED', updatedAt: '2026-11-10T00:00:00Z' },
      { id: 'b', status: 'CLOSED', updatedAt: '2026-11-01T00:00:00Z' },
    ];
    expect(selectMyConversation(list).id).toBe('a');
  });

  test('sin fechas elige la última de la lista', () => {
    expect(selectMyConversation([{ id: 'a', status: 'CLOSED' }, { id: 'b', status: 'CLOSED' }]).id).toBe('b');
  });
});
