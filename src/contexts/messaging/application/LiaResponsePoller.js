import { Senders } from '../domain/MessageSender.js';

const POLL_INTERVAL_MS = 1500;
// El backend da por vencida a Lía a los ~20 s (y envía un aviso de reserva manual);
// esperamos hasta 30 s para recibir ese aviso también.
const MAX_POLL_MS = 30000;

const defaultSleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export class LiaResponsePoller {
  /**
   * @param {{ execute: (q: { conversationId: string }) => Promise<any[]> }} getMessagesHandler
   * @param {{ intervalMs?: number, maxMs?: number, sleep?: (ms: number) => Promise<void>, now?: () => number }} [options]
   */
  constructor(getMessagesHandler, options = {}) {
    this._getMessages = getMessagesHandler;
    this._intervalMs = options.intervalMs ?? POLL_INTERVAL_MS;
    this._maxMs = options.maxMs ?? MAX_POLL_MS;
    this._sleep = options.sleep ?? defaultSleep;
    this._now = options.now ?? Date.now;
  }

  /**
   * Consulta los mensajes cada `intervalMs` hasta que aparezca un mensaje de Lía nuevo
   * (más que `previousLiaCount`), se cancele o se agote el tiempo.
   *
   * @param {{
   *   conversationId: string,
   *   previousLiaCount: number,
   *   onMessages?: (messages: any[]) => void,
   *   isCancelled?: () => boolean,
   * }} params
   * @returns {Promise<{ status: 'received' | 'timeout' | 'cancelled', messages: any[] | null }>}
   */
  async poll({ conversationId, previousLiaCount, onMessages = () => {}, isCancelled = () => false }) {
    const deadline = this._now() + this._maxMs;
    let lastMessages = null;

    while (this._now() < deadline) {
      await this._sleep(this._intervalMs);
      if (isCancelled()) return { status: 'cancelled', messages: lastMessages };

      let messages;
      try {
        messages = await this._getMessages.execute({ conversationId });
      } catch (_e) {
        // Fallo transitorio de red: seguimos intentando hasta agotar el tiempo.
        continue;
      }
      if (isCancelled()) return { status: 'cancelled', messages: lastMessages };

      lastMessages = messages;
      onMessages(messages);

      const liaCount = messages.filter((m) => m.sender === Senders.LIA).length;
      if (liaCount > previousLiaCount) {
        return { status: 'received', messages };
      }
    }
    return { status: 'timeout', messages: lastMessages };
  }
}
