import { describe, expect, test } from '@jest/globals';
import { LiaChatSession } from '../LiaChatSession.js';
import { LiaResponsePoller } from '../LiaResponsePoller.js';
import { SendMessageToLiaCommandHandler } from '../SendMessageToLiaCommandHandler.js';
import { GetMyConversationQueryHandler } from '../GetMyConversationQueryHandler.js';
import { GetConversationMessagesQueryHandler } from '../GetConversationMessagesQueryHandler.js';
import { mergeMessages } from '../mergeMessages.js';

/** Backend simulado en memoria con la misma forma que messaging-service. */
class FakeBackend {
  constructor({ conversations = [], liaRepliesAfterPolls = 1 } = {}) {
    this.conversations = conversations; // [{ id, status, messages: [] }]
    this.sendCalls = [];
    this.liaRepliesAfterPolls = liaRepliesAfterPolls;
    this._pollsSinceSend = 0;
    this._replyPending = false;
    this._seq = 0;
  }

  _conv(id) {
    return this.conversations.find((c) => c.id === id);
  }

  async sendMessage(content, coordinates, conversationId) {
    this.sendCalls.push({ content, coordinates, conversationId });
    let conv = conversationId ? this._conv(conversationId) : null;
    if (!conv) {
      conv = { id: 'conv-real-1', status: 'ACTIVE', messages: [] };
      this.conversations.push(conv);
    }
    const messageId = `m${++this._seq}`;
    conv.messages.push({ id: messageId, sender: 'EXPLORER', content, intentType: null, reservationId: null, sentAt: new Date().toISOString() });
    this._replyPending = true;
    this._pollsSinceSend = 0;
    return { conversationId: conv.id, messageId };
  }

  async getMyConversation() {
    return this.conversations[0] ?? null;
  }

  async getMessages(conversationId) {
    this._pollsSinceSend += 1;
    const conv = this._conv(conversationId);
    if (this._replyPending && this._pollsSinceSend >= this.liaRepliesAfterPolls && this.liaRepliesAfterPolls > 0) {
      conv.messages.push({ id: `m${++this._seq}`, sender: 'LIA', content: 'Prueba el ceviche', intentType: 'RECOMMENDATION', reservationId: null, sentAt: new Date().toISOString() });
      this._replyPending = false;
    }
    return [...conv.messages];
  }
}

function buildSession(backend, pollerOptions = {}) {
  let clock = 0;
  const getMessagesHandler = new GetConversationMessagesQueryHandler(backend);
  const poller = new LiaResponsePoller(getMessagesHandler, {
    intervalMs: 1500,
    maxMs: 30000,
    sleep: async (ms) => { clock += ms; },
    now: () => clock,
    ...pollerOptions,
  });
  return new LiaChatSession({
    sendHandler: new SendMessageToLiaCommandHandler(backend),
    getConversationHandler: new GetMyConversationQueryHandler(backend),
    getMessagesHandler,
    poller,
  });
}

describe('LiaChatSession — flujo de conversationId', () => {
  test('sin conversación: load() devuelve null y NO inventa un id', async () => {
    const session = buildSession(new FakeBackend());

    const loaded = await session.load();

    expect(loaded.conversation).toBeNull();
    expect(loaded.messages).toEqual([]);
    expect(session.conversationId).toBeNull();
  });

  test('el primer envío va sin conversationId y se guarda el que devuelve el backend', async () => {
    const backend = new FakeBackend();
    const session = buildSession(backend);
    await session.load();

    await session.send('quiero un ceviche barato cerca', { latitude: -12.1403, longitude: -77.0219 });

    expect(backend.sendCalls[0].conversationId).toBeNull();
    expect(backend.sendCalls[0].coordinates).toEqual({ latitude: -12.1403, longitude: -77.0219 });
    expect(session.conversationId).toBe('conv-real-1');
  });

  test('los envíos siguientes reutilizan el conversationId', async () => {
    const backend = new FakeBackend();
    const session = buildSession(backend);
    await session.load();

    await session.send('hola', null);
    await session.send('y algo más barato?', null);

    expect(backend.sendCalls.map((c) => c.conversationId)).toEqual([null, 'conv-real-1']);
  });

  test('con conversación existente carga el historial y lo reutiliza al enviar', async () => {
    const backend = new FakeBackend({
      conversations: [{
        id: 'conv-existente',
        status: 'ACTIVE',
        messages: [
          { id: 'a', sender: 'EXPLORER', content: 'hola', sentAt: '2026-11-13T09:00:00Z' },
          { id: 'b', sender: 'LIA', content: '¡Hola!', sentAt: '2026-11-13T09:00:05Z' },
        ],
      }],
    });
    const session = buildSession(backend);

    const loaded = await session.load();
    expect(loaded.conversation.id).toBe('conv-existente');
    expect(loaded.messages.map((m) => m.content)).toEqual(['hola', '¡Hola!']);

    await session.send('quiero ceviche', null);
    expect(backend.sendCalls[0].conversationId).toBe('conv-existente');
  });
});

describe('LiaChatSession — mensajes y polling', () => {
  test('muestra el mensaje optimista y lo reemplaza por el real; llega la respuesta de Lía', async () => {
    const backend = new FakeBackend({ liaRepliesAfterPolls: 2 });
    const session = buildSession(backend);
    await session.load();
    const snapshots = [];

    const outcome = await session.send('quiero ceviche', null, (messages) => snapshots.push(messages));

    expect(outcome.status).toBe('received');
    // 1.º: solo el optimista
    expect(snapshots[0]).toHaveLength(1);
    expect(snapshots[0][0].id).toMatch(/^opt-/);
    // Último: mensaje real del usuario + respuesta de Lía, sin duplicados ni optimista
    const last = snapshots[snapshots.length - 1];
    expect(last.map((m) => m.sender)).toEqual(['EXPLORER', 'LIA']);
    expect(last.some((m) => String(m.id).startsWith('opt-'))).toBe(false);
    expect(last[1].detectedIntent).toBe('RECOMMENDATION');
  });

  test('si Lía no responde, termina por timeout (30 s) sin perder el mensaje del usuario', async () => {
    const backend = new FakeBackend({ liaRepliesAfterPolls: 0 });
    const session = buildSession(backend);
    await session.load();

    const outcome = await session.send('hola', null);

    expect(outcome.status).toBe('timeout');
    expect(session.messages.map((m) => m.content)).toEqual(['hola']);
  });

  test('un mensaje repetido no se confunde con uno anterior del historial', async () => {
    const backend = new FakeBackend({
      conversations: [{
        id: 'c1',
        status: 'ACTIVE',
        messages: [{ id: 'a', sender: 'EXPLORER', content: 'hola', sentAt: '2026-11-13T09:00:00Z' }],
      }],
      liaRepliesAfterPolls: 3,
    });
    const session = buildSession(backend);
    await session.load();
    const snapshots = [];

    // Antes de que el servidor registre el nuevo "hola", el optimista debe seguir visible.
    const originalGetMessages = backend.getMessages.bind(backend);
    backend.sendMessage = async (content, coordinates, conversationId) => {
      backend.sendCalls.push({ content, coordinates, conversationId });
      backend._replyPending = false;
      return { conversationId: 'c1', messageId: 'pendiente' };
    };
    let calls = 0;
    backend.getMessages = async (id) => {
      calls += 1;
      if (calls === 2) {
        backend.conversations[0].messages.push({ id: 'b', sender: 'EXPLORER', content: 'hola', sentAt: 'x' });
        backend.conversations[0].messages.push({ id: 'c', sender: 'LIA', content: 'respuesta', sentAt: 'y' });
      }
      return originalGetMessages(id);
    };

    await session.send('hola', null, (messages) => snapshots.push(messages));

    // Primer polling: el servidor aún no tiene el nuevo mensaje → se ve historial + optimista
    expect(snapshots[1].map((m) => m.id)).toEqual(['a', expect.stringMatching(/^opt-/)]);
    // Último: historial + mensaje real + Lía
    expect(snapshots[snapshots.length - 1].map((m) => m.id)).toEqual(['a', 'b', 'c']);
  });

  test('si el envío falla se quita el mensaje optimista y se propaga el error', async () => {
    const backend = new FakeBackend();
    backend.sendMessage = async () => { throw new Error('boom'); };
    const session = buildSession(backend);
    await session.load();

    await expect(session.send('hola', null)).rejects.toThrow('boom');
    expect(session.messages).toEqual([]);
  });

  test('cancel() detiene el polling en curso', async () => {
    const backend = new FakeBackend({ liaRepliesAfterPolls: 0 });
    const session = buildSession(backend, {
      sleep: async () => { session.cancel(); },
    });
    await session.load();

    const outcome = await session.send('hola', null);

    expect(outcome.status).toBe('cancelled');
  });

  test('rechaza mensajes vacíos', async () => {
    const session = buildSession(new FakeBackend());
    await expect(session.send('   ', null)).rejects.toThrow('vacío');
  });
});

describe('mergeMessages', () => {
  const pending = (content, explorerBase) => ({ message: { id: `opt-${content}`, sender: 'EXPLORER', content }, explorerBase });

  test('mantiene el optimista mientras el servidor no lo tenga', () => {
    const result = mergeMessages([], [pending('hola', 0)]);
    expect(result.messages.map((m) => m.id)).toEqual(['opt-hola']);
    expect(result.pending).toHaveLength(1);
  });

  test('lo descarta cuando el servidor ya tiene el mensaje', () => {
    const server = [{ id: 'm1', sender: 'EXPLORER', content: 'hola' }];
    const result = mergeMessages(server, [pending('hola', 0)]);
    expect(result.messages.map((m) => m.id)).toEqual(['m1']);
    expect(result.pending).toEqual([]);
  });
});
