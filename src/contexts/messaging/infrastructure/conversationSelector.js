const DATE_FIELDS = ['lastMessageAt', 'updatedAt', 'createdAt', 'startedAt'];

function timestampOf(conversation) {
  for (const field of DATE_FIELDS) {
    const time = Date.parse(conversation?.[field]);
    if (!Number.isNaN(time)) return time;
  }
  return null;
}

/** Devuelve la conversación más reciente; si no hay fechas, la última de la lista. */
function mostRecent(conversations) {
  let best = conversations[conversations.length - 1];
  let bestTime = timestampOf(best);

  conversations.forEach((conversation) => {
    const time = timestampOf(conversation);
    if (time !== null && (bestTime === null || time > bestTime)) {
      best = conversation;
      bestTime = time;
    }
  });
  return best;
}

/**
 * GET /messaging/conversations/me devuelve una lista (puede venir vacía).
 * La app trabaja con una sola conversación: la ACTIVE (o la más reciente), o null si no hay.
 */
export function selectMyConversation(conversations) {
  if (!Array.isArray(conversations) || conversations.length === 0) return null;

  const active = conversations.filter(
    (conversation) => String(conversation?.status ?? '').toUpperCase() === 'ACTIVE',
  );
  return mostRecent(active.length > 0 ? active : conversations);
}
