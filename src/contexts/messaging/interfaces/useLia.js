import { useState, useCallback, useRef, useEffect } from 'react';
import { useDependencies } from '../../../app/providers/DependencyProvider.jsx';

export function useLia() {
  const container = useDependencies();
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [conversation, setConversation] = useState(null);
  const convIdRef = useRef(null);
  const liaCountRef = useRef(0);

  // Load or create conversation on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const conv = await container.messaging?.getConversationHandler?.execute() ??
          { id: 'default-conv', status: 'active', messages: [] };
        if (!cancelled) {
          setConversation(conv);
          convIdRef.current = conv.id;
        }
      } catch (_e) {
        if (!cancelled) {
          convIdRef.current = 'default-conv';
          setConversation({ id: 'default-conv', status: 'active', messages: [] });
        }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Poll for new messages every 1500ms when typing is true
  useEffect(() => {
    if (!isTyping) return;
    const interval = setInterval(async () => {
      try {
        const msgs = await container.messaging?.getMessagesHandler?.execute({
          conversationId: convIdRef.current || 'default-conv',
        }) ?? [];
        const liaMessages = msgs.filter((m) => m.isFromLia);
        if (liaMessages.length > liaCountRef.current) {
          liaCountRef.current = liaMessages.length;
          setMessages(msgs);
          setIsTyping(false);
        }
      } catch (_e) {
        setIsTyping(false);
      }
    }, 1500);
    return () => clearInterval(interval);
  }, [isTyping]);

  const sendMessage = useCallback(async (content, coordinates = null) => {
    if (!content || !content.trim()) return;

    // Optimistic update
    const optimisticMsg = {
      id: `opt-${Date.now()}`,
      sender: 'EXPLORER',
      content: content.trim(),
      isFromLia: false,
      sentAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticMsg]);
    setIsTyping(true);

    try {
      await container.messaging?.sendHandler?.execute({ content, coordinates });

      // Poll for Lía response (handled by useEffect above)
      // Fallback: after 5s stop typing indicator
      setTimeout(() => setIsTyping(false), 8000);
    } catch (_e) {
      setIsTyping(false);
    }
  }, [container]);

  const startReservationChat = useCallback((huariqueName) => {
    sendMessage(`Quiero reservar una mesa en ${huariqueName}`);
  }, [sendMessage]);

  const refreshMessages = useCallback(async () => {
    try {
      const msgs = await container.messaging?.getMessagesHandler?.execute({
        conversationId: convIdRef.current || 'default-conv',
      }) ?? [];
      setMessages(msgs);
      liaCountRef.current = msgs.filter((m) => m.isFromLia).length;
    } catch (_e) {}
  }, [container]);

  return {
    messages,
    sendMessage,
    isTyping,
    conversation,
    startReservationChat,
    refreshMessages,
  };
}

