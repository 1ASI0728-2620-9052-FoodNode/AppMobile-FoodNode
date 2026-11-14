import { DomainError } from '../../../shared/kernel/DomainError.js';
import { Senders } from '../domain/MessageSender.js';
import { countExplorerMessages, mergeMessages } from './mergeMessages.js';

/**
 * Estado de una sesión de chat con Lía, sin dependencias de React (así se puede probar).
 *
 * - Si el usuario no tiene conversación, NO se inventa un id: el conversationId se toma
 *   de la respuesta del primer envío y se reutiliza en los siguientes.
 * - Muestra el mensaje del usuario de forma optimista y lo reemplaza por el real
 *   cuando el servidor lo devuelve.
 * - Hace polling hasta que llega la respuesta de Lía.
 */
export class LiaChatSession {
  constructor({ sendHandler, getConversationHandler, getMessagesHandler, poller }) {
    this._sendHandler = sendHandler;
    this._getConversationHandler = getConversationHandler;
    this._getMessagesHandler = getMessagesHandler;
    this._poller = poller;

    this.conversationId = null;
    this._serverMessages = [];
    this._pending = [];
    this._token = 0;
  }

  get messages() {
    return mergeMessages(this._serverMessages, this._pending).messages;
  }

  get liaCount() {
    return this._serverMessages.filter((m) => m.sender === Senders.LIA).length;
  }

  /** Carga la conversación existente y su historial. Sin conversación: { conversation: null, messages: [] }. */
  async load() {
    const conversation = await this._getConversationHandler.execute();
    if (!conversation) return { conversation: null, messages: [] };

    this.conversationId = conversation.id;
    this._setServerMessages(await this._getMessagesHandler.execute({ conversationId: conversation.id }));
    return { conversation, messages: this.messages };
  }

  /**
   * @param {string} content
   * @param {{ latitude: number, longitude: number } | null} coordinates
   * @param {(messages: any[]) => void} onMessages  se llama cada vez que cambia la lista visible
   * @returns {Promise<{ status: 'received' | 'timeout' | 'cancelled' }>}
   */
  async send(content, coordinates, onMessages = () => {}) {
    const text = content?.trim();
    if (!text) throw new DomainError('El mensaje no puede estar vacío', 'EMPTY_MESSAGE');

    const token = ++this._token; // invalida un polling anterior
    const emit = () => onMessages(this.messages);

    const entry = {
      message: {
        id: `opt-${Date.now()}-${this._pending.length}`,
        sender: Senders.EXPLORER,
        content: text,
        detectedIntent: null,
        reservationRef: null,
        sentAt: new Date().toISOString(),
        isFromLia: false,
      },
      explorerBase: countExplorerMessages(this._serverMessages) + this._pending.length,
    };
    this._pending.push(entry);
    emit();

    let result;
    try {
      result = await this._sendHandler.execute({
        content: text,
        coordinates,
        conversationId: this.conversationId,
      });
    } catch (err) {
      this._pending = this._pending.filter((p) => p !== entry);
      emit();
      throw err;
    }

    this.conversationId = result.conversationId;
    const previousLiaCount = this.liaCount;

    const outcome = await this._poller.poll({
      conversationId: this.conversationId,
      previousLiaCount,
      isCancelled: () => token !== this._token,
      onMessages: (messages) => {
        if (token !== this._token) return;
        this._setServerMessages(messages);
        emit();
      },
    });
    return { status: outcome.status };
  }

  /** Detiene el polling en curso (al salir de la pantalla). */
  cancel() {
    this._token += 1;
  }

  _setServerMessages(messages) {
    this._serverMessages = messages;
    this._pending = mergeMessages(messages, this._pending).pending;
  }
}
