import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { useDependencies } from '../../../app/providers/DependencyProvider.jsx';
import { LiaChatSession } from '../application/LiaChatSession.js';

const LOCATION_TIMEOUT_MS = 3000;

function toPlainCoordinates(coords) {
  if (!coords) return null;
  const { latitude, longitude } = coords;
  return typeof latitude === 'number' && typeof longitude === 'number'
    ? { latitude, longitude }
    : null;
}

export function useLia() {
  const container = useDependencies();
  const { locationProvider } = container.radar;

  const session = useMemo(() => new LiaChatSession(container.messaging), [container]);

  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [conversation, setConversation] = useState(null);
  const [error, setError] = useState(null);
  const coordsRef = useRef(null);
  const mountedRef = useRef(true);

  // Ubicación del usuario (best effort): Lía la usa para recomendar cerca.
  const resolveCoordinates = useCallback(async () => {
    if (coordsRef.current) return coordsRef.current;
    try {
      const granted = await locationProvider.requestPermission();
      if (!granted) return null;
      coordsRef.current = toPlainCoordinates(await locationProvider.getCurrentCoordinates());
    } catch (_e) {
      // Sin ubicación el chat funciona igual, solo sin recomendaciones por cercanía.
    }
    return coordsRef.current;
  }, [locationProvider]);

  // Carga el historial al abrir el chat. Sin conversación no se inventa ningún id:
  // se obtiene de la respuesta del primer envío.
  useEffect(() => {
    mountedRef.current = true;
    (async () => {
      try {
        const loaded = await session.load();
        if (!mountedRef.current) return;
        setConversation(loaded.conversation);
        setMessages(loaded.messages);
      } catch (_e) {
        if (mountedRef.current) setError('No se pudo cargar tu conversación con Lía.');
      } finally {
        if (mountedRef.current) setIsLoading(false);
      }
    })();
    resolveCoordinates();

    return () => {
      mountedRef.current = false;
      session.cancel();
    };
  }, [session, resolveCoordinates]);

  const sendMessage = useCallback(async (content, coordinates = null) => {
    if (!content || !content.trim() || isTyping) return;

    setError(null);
    setIsTyping(true);
    try {
      const coords = toPlainCoordinates(coordinates)
        ?? coordsRef.current
        ?? await Promise.race([
          resolveCoordinates(),
          new Promise((resolve) => setTimeout(() => resolve(null), LOCATION_TIMEOUT_MS)),
        ]);

      await session.send(content, coords, (next) => {
        if (mountedRef.current) setMessages(next);
      });
      if (mountedRef.current && session.conversationId) {
        setConversation((prev) => prev ?? { id: session.conversationId, status: 'ACTIVE', messages: [] });
      }
    } catch (_e) {
      if (mountedRef.current) setError('No se pudo enviar tu mensaje. Intenta de nuevo.');
    } finally {
      if (mountedRef.current) setIsTyping(false);
    }
  }, [session, isTyping, resolveCoordinates]);

  const startReservationChat = useCallback((huariqueName) => {
    sendMessage(`Quiero reservar una mesa en ${huariqueName}`);
  }, [sendMessage]);

  const refreshMessages = useCallback(async () => {
    try {
      const loaded = await session.load();
      if (mountedRef.current && loaded.conversation) setMessages(loaded.messages);
    } catch (_e) {
      // Se mantiene lo que ya se muestra.
    }
  }, [session]);

  return {
    messages,
    sendMessage,
    isTyping,
    isLoading,
    error,
    conversation,
    startReservationChat,
    refreshMessages,
  };
}
