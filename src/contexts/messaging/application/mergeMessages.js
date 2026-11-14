import { Senders } from '../domain/MessageSender.js';

export function countExplorerMessages(messages) {
  return messages.filter((m) => m.sender === Senders.EXPLORER).length;
}

/**
 * Combina el historial del servidor con los mensajes optimistas todavía no confirmados.
 *
 * Cada pendiente guarda `explorerBase`: cuántos mensajes EXPLORER había (en el servidor
 * y pendientes anteriores) justo antes de enviarlo. Cuando el servidor ya tiene más que
 * eso, el mensaje real reemplaza al optimista.
 *
 * @param {any[]} serverMessages
 * @param {{ message: any, explorerBase: number }[]} pending
 * @returns {{ messages: any[], pending: { message: any, explorerBase: number }[] }}
 */
export function mergeMessages(serverMessages, pending) {
  const serverExplorerCount = countExplorerMessages(serverMessages);
  const stillPending = pending.filter((p) => serverExplorerCount <= p.explorerBase);
  return {
    messages: [...serverMessages, ...stillPending.map((p) => p.message)],
    pending: stillPending,
  };
}
