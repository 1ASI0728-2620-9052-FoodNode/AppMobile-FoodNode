import { ILiaChatRepository } from '../domain/ILiaChatRepository.js';
import { Senders } from '../domain/MessageSender.js';

const LIA_RESPONSES = {
  reservar: '¡Claro! Te ayudo a reservar. ¿Para cuándo sería la reserva? 📅',
  mesa: '¡Claro! Te ayudo a reservar. ¿Para cuándo sería la reserva? 📅',
  ceviche: '¡Para ceviche, La Concha Huarichera está increíble hoy! Su Trío Marino es legendario en Barranco. También El Pez de Oro tiene la corvina fresca. ¿Te hago una reserva?',
  pescado: '¡Para ceviche, La Concha Huarichera está increíble hoy! Su Trío Marino es legendario en Barranco. También El Pez de Oro tiene la corvina fresca. ¿Te hago una reserva?',
  mariscos: '¡Para ceviche, La Concha Huarichera está increíble hoy! Su Trío Marino es legendario en Barranco. También El Pez de Oro tiene la corvina fresca. ¿Te hago una reserva?',
  barato: 'Anticuchos San Pedro es la opción más accesible, desde S/15. ¡Y están abren hasta tarde! ¿Quieres que reserve?',
  economico: 'Anticuchos San Pedro es la opción más accesible, desde S/15. ¡Y están abren hasta tarde! ¿Quieres que reserve?',
  económico: 'Anticuchos San Pedro es la opción más accesible, desde S/15. ¡Y están abren hasta tarde! ¿Quieres que reserve?',
};

const DEFAULT_LIA_RESPONSE =
  '¡Hola! Soy Lía, tu copiloto gastronómico 🍽️ ¿Qué se te antoja hoy? Tengo info de los mejores huariques de Barranco.';

function detectIntent(content) {
  const lower = content.toLowerCase();
  for (const [keyword, response] of Object.entries(LIA_RESPONSES)) {
    if (lower.includes(keyword)) return { response, intent: keyword };
  }
  return { response: DEFAULT_LIA_RESPONSE, intent: null };
}

let _convIdCounter = 1;
let _msgIdCounter = 100;

function newMsgId() {
  return `msg-${_msgIdCounter++}`;
}

export class MockLiaChatRepository extends ILiaChatRepository {
  constructor() {
    super();
    // Map<userId, { id, status, messages[] }>
    this._conversations = new Map();
    this._defaultConvId = `conv-${_convIdCounter++}`;
    this._conversations.set('default', {
      id: this._defaultConvId,
      status: 'active',
      messages: [],
    });
  }

  _getConv() {
    return this._conversations.get('default');
  }

  async sendMessage(content, _coordinates, _conversationId) {
    const delay = 300 + Math.random() * 400;
    await new Promise((r) => setTimeout(r, delay));

    const conv = this._getConv();
    const userMsg = {
      id: newMsgId(),
      sender: Senders.EXPLORER,
      content,
      detectedIntent: null,
      reservationRef: null,
      sentAt: new Date().toISOString(),
    };
    conv.messages.push(userMsg);

    // Schedule Lía response asynchronously
    const { response, intent } = detectIntent(content);
    const liaDelay = 1500 + Math.random() * 1500;
    setTimeout(() => {
      const liaMsg = {
        id: newMsgId(),
        sender: Senders.LIA,
        content: response,
        detectedIntent: intent,
        reservationRef: null,
        sentAt: new Date().toISOString(),
      };
      conv.messages.push(liaMsg);
    }, liaDelay);

    return { conversationId: conv.id, messageId: userMsg.id };
  }

  async getMyConversation() {
    await new Promise((r) => setTimeout(r, 200));
    const conv = this._getConv();
    // Igual que el backend: sin mensajes todavía no hay conversación.
    if (conv.messages.length === 0) return null;
    return { id: conv.id, status: 'ACTIVE', messages: [] };
  }

  async getMessages(_conversationId) {
    await new Promise((r) => setTimeout(r, 100));
    return [...this._getConv().messages];
  }
}

