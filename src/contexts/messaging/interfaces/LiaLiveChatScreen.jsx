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
import { MessageBubble } from './MessageBubble.jsx';
import { useLia } from './useLia.js';

/**
 * Chat con Lía conectado a messaging-service (se usa cuando MOCK_MESSAGING=false).
 * La versión con guion para el modo demo es LiaDemoChatScreen.
 */
export function LiaLiveChatScreen() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const { messages, sendMessage, startReservationChat, isTyping, isLoading, error } = useLia();
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);
  const autoStartedRef = useRef(false);

  // Si llegamos desde "Reservar" en el detalle de un huarique, Lía arranca la reserva.
  useEffect(() => {
    if (isLoading || autoStartedRef.current || !params?.restaurantId) return;
    const place = DEMO_HUARIQUES.find((item) => item.id === params.restaurantId);
    if (!place) return;
    autoStartedRef.current = true;
    startReservationChat(place.name);
  }, [isLoading, params?.restaurantId, startReservationChat]);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages, isTyping]);

  const send = () => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;
    setInput('');
    sendMessage(trimmed);
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
            <Text style={styles.headerStatus}>● En línea</Text>
          </View>
          <Ionicons name="sparkles" size={20} color={colors.primary} />
        </View>

        <ScrollView
          ref={scrollRef}
          style={styles.messageList}
          contentContainerStyle={styles.messageContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {isLoading ? <Text style={styles.hint}>Cargando tu conversación…</Text> : null}
          {!isLoading && messages.length === 0 ? (
            <Text style={styles.hint}>
              ¡Hola! Soy Lía, tu copiloto gastronómico 🍽️ Cuéntame qué se te antoja y te recomiendo un huarique cerca.
            </Text>
          ) : null}
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {isTyping ? (
            <View style={styles.typing}><Text style={styles.typingText}>Lía está escribiendo…</Text></View>
          ) : null}
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </ScrollView>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Escribe a Lía…"
            placeholderTextColor={colors.textSecondary}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={send}
            returnKeyType="send"
            editable={!isLoading}
          />
          <TouchableOpacity
            style={[styles.sendButton, (isTyping || isLoading) && styles.sendButtonDisabled]}
            onPress={send}
            disabled={isTyping || isLoading}
            accessibilityLabel="Enviar mensaje"
          >
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
  messageList: { flex: 1 },
  messageContent: { paddingVertical: spacing.md },
  hint: { marginHorizontal: spacing.md, marginBottom: spacing.sm, color: colors.textSecondary, fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.sm, lineHeight: 20 },
  typing: { alignSelf: 'flex-start', marginLeft: 52, marginBottom: spacing.sm, padding: spacing.sm, borderRadius: 14, backgroundColor: colors.surface },
  typingText: { color: colors.textSecondary, fontFamily: typography.fontFamily.regular, fontSize: 11 },
  error: { marginHorizontal: spacing.md, color: colors.danger, fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.sm },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.surface },
  input: { flex: 1, minHeight: 44, paddingHorizontal: spacing.md, borderRadius: 22, backgroundColor: colors.background, color: colors.brownDark, fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.sm },
  sendButton: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary },
  sendButtonDisabled: { opacity: 0.5 },
});
