import { describe, expect, jest, test } from '@jest/globals';
import { MessageDto } from '../MessageDto.js';
import { SendMessageToLiaCommandHandler } from '../SendMessageToLiaCommandHandler.js';
import { GetMyConversationQueryHandler } from '../GetMyConversationQueryHandler.js';

describe('MessageDto.fromRaw', () => {
  test('mapea intentType → detectedIntent y reservationId → reservationRef', () => {
    const dto = MessageDto.fromRaw({
      id: 'm1',
      sender: 'LIA',
      content: 'Te recomiendo La Concha Huarichera',
      intentType: 'RECOMMENDATION',
      huariqueId: 'h1',
      reservationId: 'res-9',
      sentAt: '2026-11-13T10:00:00Z',
    });

    expect(dto).toEqual({
      id: 'm1',
      sender: 'LIA',
      content: 'Te recomiendo La Concha Huarichera',
      detectedIntent: 'RECOMMENDATION',
      reservationRef: 'res-9',
      sentAt: '2026-11-13T10:00:00Z',
      isFromLia: true,
    });
  });

  test('mensaje del explorador sin intención ni reserva', () => {
    const dto = MessageDto.fromRaw({ id: 'm2', sender: 'EXPLORER', content: 'hola', intentType: null, reservationId: null, sentAt: '2026-11-13T10:00:00Z' });
    expect(dto.isFromLia).toBe(false);
    expect(dto.detectedIntent).toBeNull();
    expect(dto.reservationRef).toBeNull();
  });

  test('sigue aceptando las variantes del mock (detectedIntent / reservationRef)', () => {
    const dto = MessageDto.fromRaw({ id: 'm3', sender: 'LIA', content: 'x', detectedIntent: 'ceviche', reservationRef: 'r1', sentAt: 'now' });
    expect(dto.detectedIntent).toBe('ceviche');
    expect(dto.reservationRef).toBe('r1');
  });
});

describe('SendMessageToLiaCommandHandler', () => {
  test('rechaza mensajes vacíos sin llamar al repositorio', async () => {
    const repository = { sendMessage: jest.fn() };
    const handler = new SendMessageToLiaCommandHandler(repository);

    await expect(handler.execute({ content: '   ' })).rejects.toThrow('vacío');
    expect(repository.sendMessage).not.toHaveBeenCalled();
  });

  test('envía el texto recortado con coordenadas y conversationId, y devuelve { conversationId, messageId }', async () => {
    const repository = { sendMessage: jest.fn().mockResolvedValue({ conversationId: 'c1', messageId: 'm1' }) };
    const handler = new SendMessageToLiaCommandHandler(repository);
    const coordinates = { latitude: -12.14, longitude: -77.02 };

    const result = await handler.execute({ content: '  quiero ceviche  ', coordinates, conversationId: 'c1' });

    expect(repository.sendMessage).toHaveBeenCalledWith('quiero ceviche', coordinates, 'c1');
    expect(result).toEqual({ conversationId: 'c1', messageId: 'm1' });
  });

  test('sin conversación previa envía conversationId null', async () => {
    const repository = { sendMessage: jest.fn().mockResolvedValue({ conversationId: 'nueva', messageId: 'm1' }) };
    const handler = new SendMessageToLiaCommandHandler(repository);

    await handler.execute({ content: 'hola' });

    expect(repository.sendMessage).toHaveBeenCalledWith('hola', null, null);
  });
});

describe('GetMyConversationQueryHandler', () => {
  test('devuelve null cuando el usuario no tiene conversación', async () => {
    const handler = new GetMyConversationQueryHandler({ getMyConversation: async () => null });
    await expect(handler.execute()).resolves.toBeNull();
  });

  test('devuelve la conversación como DTO', async () => {
    const handler = new GetMyConversationQueryHandler({
      getMyConversation: async () => ({ id: 'c1', status: 'ACTIVE' }),
    });
    await expect(handler.execute()).resolves.toEqual({ id: 'c1', status: 'ACTIVE', messages: [] });
  });
});
