import React, { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../../shared/interfaces/theme/colors.js';
import { spacing } from '../../../shared/interfaces/theme/spacing.js';
import { typography } from '../../../shared/interfaces/theme/typography.js';
import { DEMO_HUARIQUES } from '../../../shared/demo/demoHuariques.js';
import { useDemoData } from '../../../app/providers/DemoDataProvider.jsx';

const QUICK_DATES = ['Hoy', 'Mañana', 'Este sábado'];
const QUICK_TIMES = ['1:00 p. m.', '7:00 p. m.', '8:30 p. m.'];
const QUICK_GUESTS = ['1 persona', '2 personas', '4 personas'];

export function LiaChatScreen() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const initialPlace = DEMO_HUARIQUES.find((item) => item.id === params?.restaurantId);
  const [place, setPlace] = useState(initialPlace ?? null);
  const [step, setStep] = useState(initialPlace ? 'date' : 'start');
  const [draft, setDraft] = useState({ restaurantId: initialPlace?.id ?? null });
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([{
    id: 'welcome',
    from: 'lia',
    text: initialPlace
      ? `¡Hola! Soy Lía 👋 Te ayudo a reservar en ${initialPlace.name}. ¿Qué día te gustaría ir?`
      : '¡Hola! Soy Lía, tu copiloto gastronómico 🍽️ ¿Qué se te antoja? También puedo ayudarte a reservar.',
  }]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);
  const { addReservation } = useDemoData();

  const addMessage = (from, text) => {
    setMessages((current) => [...current, { id: `${Date.now()}-${Math.random()}`, from, text }]);
  };

  const options = step === 'start'
    ? [
        { label: 'Reservar una mesa', value: 'Quiero reservar una mesa' },
        { label: 'Se me antoja ceviche', value: 'Quiero ceviche' },
        { label: 'Ver rutas', value: 'Muéstrame rutas' },
      ]
    : step === 'restaurant'
      ? DEMO_HUARIQUES.map((item) => ({ label: item.name, value: item.id }))
      : step === 'date'
      ? QUICK_DATES.map((item) => ({ label: item, value: item }))
      : step === 'time'
        ? QUICK_TIMES.map((item) => ({ label: item, value: item }))
        : step === 'guests'
          ? QUICK_GUESTS.map((item) => ({ label: item, value: item }))
          : step === 'confirm'
            ? [{ label: 'Confirmar reserva', value: 'confirm' }]
            : [{ label: 'Hacer otra reserva', value: 'again' }];

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages, isTyping]);

  const askNext = (nextStep, nextDraft) => {
    setStep(nextStep);
    const prompts = {
      date: `¡Buena elección! ¿Qué día quieres ir a ${place?.name}?`,
      time: '¿A qué hora prefieres tu mesa?',
      guests: '¿Para cuántas personas hago la reserva?',
      confirm: `Revisa tu reserva:\n🍽️ ${place?.name}\n📅 ${nextDraft.date}\n🕒 ${nextDraft.time}\n👥 ${nextDraft.guests}\n\n¿La confirmo?`,
    };
    addMessage('lia', prompts[nextStep]);
  };

  const processAnswer = (value) => {
    if (step === 'start') {
      const normalized = value.toLowerCase();
      if (normalized.includes('reserv') || normalized.includes('mesa') || normalized.includes('cevich')) {
        setStep('restaurant');
        addMessage('lia', normalized.includes('cevich')
          ? '¡Se me antojó! Elige un lugar para ir por algo marino y te ayudo con la reserva.'
          : '¡Claro! Elige un huarique y armamos tu reserva demo.');
      } else {
        addMessage('lia', '¡Vamos a ver las rutas gastronómicas! 🗺️');
        navigation.getParent()?.navigate('Rutas');
      }
      return;
    }

    if (step === 'restaurant') {
      const selected = DEMO_HUARIQUES.find((item) =>
        item.id === value || item.name.toLowerCase().includes(value.toLowerCase()),
      ) ?? DEMO_HUARIQUES[0];
      setPlace(selected);
      const next = { ...draft, restaurantId: selected.id };
      setDraft(next);
      askNext('date', next);
      return;
    }

    if (step === 'date' || step === 'time') {
      const next = { ...draft, [step]: value };
      setDraft(next);
      askNext(step === 'date' ? 'time' : 'guests', next);
      return;
    }

    if (step === 'guests') {
      const guests = value.match(/\d+/)?.[0] ?? '2';
      const next = { ...draft, guests: `${guests} ${Number(guests) === 1 ? 'persona' : 'personas'}` };
      setDraft(next);
      askNext('confirm', next);
      return;
    }

    if (step === 'confirm' && value === 'confirm') {
      const booking = addReservation({
        restaurantId: place?.id,
        restaurantName: place?.name,
        date: draft.date,
        time: draft.time,
        guests: draft.guests,
      });
      setStep('done');
      addMessage('lia', `¡Listo! Tu reserva demo está confirmada en ${place?.name} 🎉\nCódigo: ${booking.code}\n\nLa verás en la pestaña Rutas, en “Mis reservas”.`);
      return;
    }

    if (step === 'done' && value === 'again') {
      setDraft({});
      setPlace(null);
      setStep('restaurant');
      addMessage('lia', '¡Vamos por otra! Elige un huarique para comenzar.');
      return;
    }

    const normalized = value.toLowerCase();
    if (normalized.includes('reserv') || normalized.includes('mesa')) {
      setStep('restaurant');
      addMessage('lia', '¡Claro! Elige uno de estos huariques y armo tu reserva demo.');
    } else if (normalized.includes('cevich') || normalized.includes('mar')) {
      setStep('restaurant');
      addMessage('lia', '¡Se me antojó! Estos lugares marinos están buenazos. Elige uno y te ayudo con la reserva.');
    } else if (normalized.includes('ruta')) {
      addMessage('lia', 'En la pestaña Rutas puedes elegir un recorrido y simular cada parada 🗺️');
    } else {
      addMessage('lia', '¡Qué rico! Puedo recomendarte lugares, mostrarte rutas o ayudarte a reservar. ¿Qué prefieres?');
    }
  };

  const send = (value = input) => {
    const trimmed = value.trim();
    if (!trimmed || isTyping) return;
    setInput('');
    addMessage('user', trimmed);
    setIsTyping(true);
    setTimeout(() => {
      processAnswer(trimmed);
      setIsTyping(false);
    }, 420);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView style={styles.keyboard} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={21} color={colors.brownDark} />
          </TouchableOpacity>
          <View style={styles.avatar}><Text style={styles.avatarText}>L</Text></View>
          <View style={styles.headerCopy}>
            <Text style={styles.headerTitle}>Lía Copiloto</Text>
            <Text style={styles.headerStatus}>● En línea · Modo demo</Text>
          </View>
          <Ionicons name="sparkles" size={20} color={colors.primary} />
        </View>

        <View style={styles.demoBanner}>
          <Ionicons name="flask-outline" size={15} color={colors.primary} />
          <Text style={styles.demoBannerText}>Chat y reservas simulados. No se envía ninguna solicitud real.</Text>
        </View>

        <ScrollView
          ref={scrollRef}
          style={styles.messageList}
          contentContainerStyle={styles.messageContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {messages.map((message) => (
            <View key={message.id} style={[styles.messageRow, message.from === 'user' && styles.userRow]}>
              {message.from === 'lia' ? <View style={styles.smallAvatar}><Text style={styles.smallAvatarText}>L</Text></View> : null}
              <View style={[styles.bubble, message.from === 'user' ? styles.userBubble : styles.liaBubble]}>
                <Text style={[styles.messageText, message.from === 'user' && styles.userMessageText]}>{message.text}</Text>
                <Text style={[styles.timestamp, message.from === 'user' && styles.userTimestamp]}>Ahora · Demo</Text>
              </View>
            </View>
          ))}
          {isTyping ? (
            <View style={styles.typing}><Text style={styles.typingText}>Lía está escribiendo…</Text></View>
          ) : null}
        </ScrollView>

        {options.length ? (
          <ScrollView
            horizontal
            style={styles.quickOptionsViewport}
            contentContainerStyle={styles.quickOptions}
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {options.map((option) => (
              <TouchableOpacity
                key={`${step}-${option.value}`}
                style={[styles.quickOption, step === 'restaurant' && styles.restaurantOption]}
                onPress={() => send(option.value)}
                disabled={isTyping}
              >
                <Text style={styles.quickOptionText} numberOfLines={1}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : null}

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder={step === 'date' ? 'Escribe otro día…' : 'Escribe a Lía…'}
            placeholderTextColor={colors.textSecondary}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={() => send()}
            returnKeyType="send"
          />
          <TouchableOpacity style={styles.sendButton} onPress={() => send()} accessibilityLabel="Enviar mensaje">
            <Ionicons name="send" size={18} color={colors.surface} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  keyboard: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: spacing.sm, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
  backButton: { width: 36, height: 40, alignItems: 'flex-start', justifyContent: 'center' },
  avatar: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary },
  avatarText: { color: colors.surface, fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.lg },
  headerCopy: { flex: 1, marginLeft: spacing.sm },
  headerTitle: { color: colors.brownDark, fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.md },
  headerStatus: { marginTop: 2, color: colors.success, fontFamily: typography.fontFamily.semiBold, fontSize: 10 },
  demoBanner: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, backgroundColor: colors.peach },
  demoBannerText: { flex: 1, color: colors.brownDark, fontFamily: typography.fontFamily.regular, fontSize: 10 },
  messageList: { flex: 1 },
  messageContent: { paddingVertical: spacing.md },
  messageRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: spacing.sm, paddingHorizontal: spacing.md },
  userRow: { justifyContent: 'flex-end' },
  smallAvatar: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: spacing.xs, backgroundColor: colors.primary },
  smallAvatarText: { color: colors.surface, fontFamily: typography.fontFamily.bold, fontSize: 11 },
  bubble: { maxWidth: '82%', padding: spacing.md, borderRadius: spacing.borderRadius.lg },
  liaBubble: { borderTopLeftRadius: 4, backgroundColor: colors.surface },
  userBubble: { borderTopRightRadius: 4, backgroundColor: colors.primary },
  messageText: { color: colors.brownDark, fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.sm, lineHeight: 20 },
  userMessageText: { color: colors.surface },
  timestamp: { marginTop: 5, color: colors.textSecondary, textAlign: 'right', fontFamily: typography.fontFamily.regular, fontSize: 9 },
  userTimestamp: { color: '#FCE1CF' },
  typing: { alignSelf: 'flex-start', marginLeft: 52, marginBottom: spacing.sm, padding: spacing.sm, borderRadius: 14, backgroundColor: colors.surface },
  typingText: { color: colors.textSecondary, fontFamily: typography.fontFamily.regular, fontSize: 11 },
  quickOptionsViewport: { flexGrow: 0, flexShrink: 0, height: 56 },
  quickOptions: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, gap: spacing.xs },
  quickOption: { flexShrink: 0, maxWidth: 210, minHeight: 38, justifyContent: 'center', paddingHorizontal: spacing.md, borderWidth: 1, borderColor: colors.primary, borderRadius: 19, backgroundColor: colors.surface },
  restaurantOption: { maxWidth: 180, backgroundColor: colors.peach, borderColor: colors.peach },
  quickOptionText: { color: colors.primary, fontFamily: typography.fontFamily.semiBold, fontSize: 11 },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.surface },
  input: { flex: 1, minHeight: 44, paddingHorizontal: spacing.md, borderRadius: 22, backgroundColor: colors.background, color: colors.brownDark, fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.sm },
  sendButton: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary },
});
