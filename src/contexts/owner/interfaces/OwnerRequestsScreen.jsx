import React, { useMemo, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../../shared/interfaces/ui/ScreenContainer.jsx';
import { Card } from '../../../shared/interfaces/ui/Card.jsx';
import { colors, spacing, typography } from '../../../shared/interfaces/theme/index.js';

const INITIAL_REQUESTS = [
  {
    id: 'r1',
    name: 'Carlos Mendoza',
    time: '1:30 PM',
    date: 'Hoy',
    party: 4,
    occasion: 'Ronda Marina Criolla + Conchas Negras',
    note: 'Viene especialmente por la Ronda Marina. Solicita mesa con sombra completa para bebé de 6 meses.',
    message: 'Mesa 4 en terraza reservada con chilanito',
    tag: 'Terraza Criolla',
  },
  {
    id: 'r2',
    name: 'Lucía Valdivia',
    time: '2:00 PM',
    date: 'Hoy',
    party: 2,
    occasion: 'Aniversario',
    note: 'Celebran 3er aniversario. Preguntó si es posible reservar espacio para postre.',
    message: 'Mesa íntima lista · Sorpresa con velita de la casa',
    tag: 'Aniversario',
  },
  {
    id: 'r3',
    name: 'Mateo Quispe',
    time: '2:30 PM',
    date: 'Hoy',
    party: 6,
    occasion: 'Almuerzo familiar',
    note: 'Almuerzo familiar de domingo. Preguntan si el Arroz con Pato estará disponible.',
    message: 'Mesa para seis junto al jardín',
    tag: 'Salón Central',
  },
];

const FILTERS = [
  { id: 'pending', label: 'Pendientes' },
  { id: 'approved', label: 'Aprobadas' },
  { id: 'rejected', label: 'Rechazadas' },
];

export function OwnerRequestsScreen() {
  const [requests, setRequests] = useState(INITIAL_REQUESTS.map((item) => ({ ...item, status: 'pending' })));
  const [filter, setFilter] = useState('pending');
  const filteredRequests = useMemo(
    () => requests.filter((request) => request.status === filter),
    [requests, filter],
  );
  const pendingCount = requests.filter((request) => request.status === 'pending').length;
  const approvedCount = requests.filter((request) => request.status === 'approved').length;

  const updateRequest = (id, status) => {
    setRequests((current) => current.map((request) => (
      request.id === id ? { ...request, status } : request
    )));
    Alert.alert(
      status === 'approved' ? 'Reserva aprobada' : 'Solicitud rechazada',
      'El cambio se guardó en esta vista.',
    );
  };

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>GESTIÓN HUARIQUE</Text>
          <Text style={styles.title}>Solicitudes</Text>
        </View>
        <TouchableOpacity style={styles.headerButton} onPress={() => Alert.alert('Avisos', 'No tienes avisos nuevos.')}>
          <Ionicons name="notifications-outline" size={22} color={colors.primary} />
          {pendingCount > 0 ? <View style={styles.notificationDot} /> : null}
        </TouchableOpacity>
      </View>

      <View style={styles.assistantRow}>
        <View style={styles.assistantIcon}>
          <Ionicons name="sparkles" size={16} color={colors.surface} />
        </View>
        <View style={styles.assistantCopy}>
          <Text style={styles.assistantTitle}>Asistente Lía</Text>
          <Text style={styles.assistantSubtitle}>Tus reservas están al día</Text>
        </View>
        <View style={styles.verifiedBadge}>
          <Ionicons name="checkmark-circle" size={13} color={colors.success} />
          <Text style={styles.verifiedText}>Verificado</Text>
        </View>
      </View>

      <View style={styles.summaryRow}>
        <SummaryCard value={`${pendingCount}`} label="Pendientes" caption="hoy" highlight />
        <SummaryCard value={`${approvedCount}`} label="Aprobadas" caption="esta semana" />
        <SummaryCard value="9" label="Atendidas" caption="este mes" />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {FILTERS.map((item) => {
          const count = requests.filter((request) => request.status === item.id).length;
          const selected = filter === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => setFilter(item.id)}
              style={[styles.filterChip, selected && styles.filterChipSelected]}
              accessibilityRole="button"
              accessibilityState={{ selected }}
            >
              <Text style={[styles.filterText, selected && styles.filterTextSelected]}>{item.label}</Text>
              <Text style={[styles.filterCount, selected && styles.filterCountSelected]}>{count}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {filteredRequests.length ? filteredRequests.map((request) => (
        <ReservationCard key={request.id} request={request} onUpdate={updateRequest} />
      )) : (
        <Card style={styles.emptyCard}>
          <View style={styles.emptyIcon}>
            <Ionicons name="checkmark-done-outline" size={26} color={colors.primary} />
          </View>
          <Text style={styles.emptyTitle}>No hay solicitudes aquí</Text>
          <Text style={styles.emptyText}>Cuando recibas solicitudes, aparecerán en esta sección.</Text>
        </Card>
      )}
    </ScreenContainer>
  );
}

function SummaryCard({ value, label, caption, highlight }) {
  return (
    <View style={[styles.summaryCard, highlight && styles.summaryHighlight]}>
      <Text style={[styles.summaryValue, highlight && styles.summaryValueHighlight]}>{value}</Text>
      <Text style={[styles.summaryLabel, highlight && styles.summaryLabelHighlight]}>{label}</Text>
      <Text style={[styles.summaryCaption, highlight && styles.summaryCaptionHighlight]}>{caption}</Text>
    </View>
  );
}

function ReservationCard({ request, onUpdate }) {
  const statusLabel = request.status === 'approved' ? 'Aprobada' : 'Rechazada';
  return (
    <Card style={styles.requestCard}>
      <View style={styles.guestRow}>
        <View style={styles.guestAvatar}>
          <Text style={styles.guestInitial}>{request.name.charAt(0)}</Text>
        </View>
        <View style={styles.guestDetails}>
          <Text style={styles.guestName}>{request.name}</Text>
          <Text style={styles.guestMeta}>{request.time} · {request.date}</Text>
        </View>
        <View style={styles.partyCount}>
          <Ionicons name="people-outline" size={15} color={colors.textSecondary} />
          <Text style={styles.partyText}>{request.party} pers.</Text>
        </View>
      </View>

      <View style={styles.occasionRow}>
        <Ionicons name="sparkles-outline" size={14} color={colors.primary} />
        <Text style={styles.occasionText}>{request.occasion}</Text>
      </View>

      <View style={styles.noteBox}>
        <View style={styles.noteHeading}>
          <View style={styles.liaDot}><Ionicons name="sparkles" size={11} color={colors.surface} /></View>
          <Text style={styles.noteLabel}>Nota de Lía</Text>
        </View>
        <Text style={styles.noteText}>“{request.note}”</Text>
      </View>

      {request.status === 'pending' ? (
        <>
          <Text style={styles.messageLabel}>Respuesta confirmatoria sugerida</Text>
          <TouchableOpacity
            style={styles.messageSuggestion}
            onPress={() => Alert.alert('Mensaje', 'La respuesta sugerida se copió para esta reserva.')}
          >
            <Text style={styles.messageText}>{request.message}</Text>
            <Ionicons name="copy-outline" size={16} color={colors.primary} />
          </TouchableOpacity>
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.rejectButton}
              onPress={() => onUpdate(request.id, 'rejected')}
            >
              <Ionicons name="close" size={17} color={colors.danger} />
              <Text style={styles.rejectText}>Rechazar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.approveButton}
              onPress={() => onUpdate(request.id, 'approved')}
            >
              <Ionicons name="checkmark-circle" size={17} color={colors.surface} />
              <Text style={styles.approveText}>Aprobar reserva</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={[styles.statusBanner, request.status === 'approved' ? styles.approvedBanner : styles.rejectedBanner]}>
          <Ionicons
            name={request.status === 'approved' ? 'checkmark-circle' : 'close-circle'}
            size={18}
            color={request.status === 'approved' ? colors.success : colors.danger}
          />
          <Text style={[styles.statusText, request.status === 'rejected' && styles.rejectedText]}>
            {statusLabel}
          </Text>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md },
  eyebrow: { color: colors.primary, fontFamily: typography.fontFamily.bold, fontSize: 10, letterSpacing: 1.1 },
  title: { color: colors.brownDark, fontFamily: typography.fontFamily.extraBold, fontSize: typography.fontSize.xl, marginTop: 2 },
  headerButton: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface },
  notificationDot: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.warning },
  assistantRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: spacing.borderRadius.lg, padding: spacing.md, marginBottom: spacing.md },
  assistantIcon: { width: 30, height: 30, borderRadius: 15, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginRight: spacing.sm },
  assistantCopy: { flex: 1 },
  assistantTitle: { color: colors.brownDark, fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.sm },
  assistantSubtitle: { color: colors.textSecondary, fontFamily: typography.fontFamily.regular, fontSize: 11, marginTop: 2 },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EFF6DA', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 5, gap: 3 },
  verifiedText: { color: colors.success, fontFamily: typography.fontFamily.semiBold, fontSize: 9 },
  summaryRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  summaryCard: { flex: 1, backgroundColor: colors.surface, borderRadius: spacing.borderRadius.md, paddingVertical: spacing.md, paddingHorizontal: spacing.sm },
  summaryHighlight: { backgroundColor: '#FFE5D4' },
  summaryValue: { color: colors.brownDark, fontFamily: typography.fontFamily.extraBold, fontSize: typography.fontSize.lg },
  summaryValueHighlight: { color: colors.primary },
  summaryLabel: { color: colors.brownDark, fontFamily: typography.fontFamily.semiBold, fontSize: 10, marginTop: 3 },
  summaryLabelHighlight: { color: colors.primary },
  summaryCaption: { color: colors.textSecondary, fontFamily: typography.fontFamily.regular, fontSize: 9, marginTop: 2 },
  summaryCaptionHighlight: { color: colors.primary },
  filterRow: { gap: spacing.sm, paddingBottom: spacing.md },
  filterChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 20, paddingVertical: 8, paddingHorizontal: 12, gap: 7 },
  filterChipSelected: { borderColor: colors.primary, backgroundColor: colors.peach },
  filterText: { color: colors.textSecondary, fontFamily: typography.fontFamily.semiBold, fontSize: 11 },
  filterTextSelected: { color: colors.primary },
  filterCount: { color: colors.textSecondary, fontFamily: typography.fontFamily.bold, fontSize: 10 },
  filterCountSelected: { color: colors.primary },
  requestCard: { padding: spacing.md, marginBottom: spacing.md },
  guestRow: { flexDirection: 'row', alignItems: 'center' },
  guestAvatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#F6D6C1', alignItems: 'center', justifyContent: 'center', marginRight: spacing.sm },
  guestInitial: { color: colors.primary, fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.md },
  guestDetails: { flex: 1 },
  guestName: { color: colors.brownDark, fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.sm },
  guestMeta: { color: colors.textSecondary, fontFamily: typography.fontFamily.regular, fontSize: 11, marginTop: 3 },
  partyCount: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  partyText: { color: colors.textSecondary, fontFamily: typography.fontFamily.semiBold, fontSize: 10 },
  occasionRow: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.peach, borderRadius: spacing.borderRadius.sm, padding: spacing.sm, marginTop: spacing.md },
  occasionText: { flex: 1, color: colors.brownDark, fontFamily: typography.fontFamily.semiBold, fontSize: 11 },
  noteBox: { backgroundColor: '#FFF0E5', borderRadius: spacing.borderRadius.md, padding: spacing.md, marginTop: spacing.sm },
  noteHeading: { flexDirection: 'row', alignItems: 'center', marginBottom: 6, gap: 6 },
  liaDot: { width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary },
  noteLabel: { color: colors.primary, fontFamily: typography.fontFamily.bold, fontSize: 10 },
  noteText: { color: colors.brownDark, fontFamily: typography.fontFamily.regular, fontSize: 11, lineHeight: 17 },
  messageLabel: { color: colors.textSecondary, fontFamily: typography.fontFamily.semiBold, fontSize: 10, marginTop: spacing.md, marginBottom: 5 },
  messageSuggestion: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.peach, borderRadius: spacing.borderRadius.sm, padding: spacing.sm, gap: spacing.sm },
  messageText: { color: colors.brownDark, fontFamily: typography.fontFamily.regular, fontSize: 10, flex: 1 },
  actionsRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  rejectButton: { flex: 1, minHeight: 42, borderWidth: 1, borderColor: '#F0C9B7', borderRadius: spacing.borderRadius.md, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 5 },
  rejectText: { color: colors.danger, fontFamily: typography.fontFamily.bold, fontSize: 11 },
  approveButton: { flex: 1.5, minHeight: 42, backgroundColor: colors.primary, borderRadius: spacing.borderRadius.md, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 5 },
  approveText: { color: colors.surface, fontFamily: typography.fontFamily.bold, fontSize: 11 },
  statusBanner: { flexDirection: 'row', alignItems: 'center', gap: 6, padding: spacing.sm, borderRadius: spacing.borderRadius.sm, marginTop: spacing.md },
  approvedBanner: { backgroundColor: '#EFF6DA' },
  rejectedBanner: { backgroundColor: '#FFF0F0' },
  statusText: { color: colors.success, fontFamily: typography.fontFamily.bold, fontSize: 12 },
  rejectedText: { color: colors.danger },
  emptyCard: { alignItems: 'center', paddingVertical: spacing.xxl },
  emptyIcon: { width: 54, height: 54, borderRadius: 27, backgroundColor: colors.peach, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { color: colors.brownDark, fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.md, marginTop: spacing.md },
  emptyText: { color: colors.textSecondary, fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.sm, textAlign: 'center', lineHeight: 20, marginTop: spacing.xs },
});
