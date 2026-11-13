import React, { useState } from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../../shared/interfaces/ui/ScreenContainer.jsx';
import { Card } from '../../../shared/interfaces/ui/Card.jsx';
import { colors, spacing, typography } from '../../../shared/interfaces/theme/index.js';

const INITIAL_MENU = [
  { name: 'Lomo saltado al jugo', description: 'Wok al fuego vivo con papas amarillas fritas', price: '28.00', icon: 'restaurant-outline' },
  { name: 'Causa rellena casera', description: 'Papa amarilla cremosa, palta y pollo deshilachado', price: '18.00', icon: 'fish-outline' },
];

export function OwnerBusinessScreen() {
  const [businessName, setBusinessName] = useState('La Concha Huariquera');
  const [address, setAddress] = useState('Calle Lizardo Montero 341, Surquillo');
  const [category, setCategory] = useState('Criolla');
  const [days, setDays] = useState('Mar - Dom');
  const [hours, setHours] = useState('11:30 AM - 5:00 PM');
  const [ticket, setTicket] = useState('35');
  const [menu, setMenu] = useState(INITIAL_MENU);
  const [editingMenuIndex, setEditingMenuIndex] = useState(null);
  const [editingPrice, setEditingPrice] = useState('');

  const saveChanges = () => {
    Alert.alert('Cambios guardados', 'La información de tu huarique se actualizó en esta vista.');
  };

  const editMenuItem = (index) => {
    setEditingMenuIndex(index);
    setEditingPrice(menu[index].price);
  };

  const saveMenuPrice = () => {
    const parsedPrice = Number(editingPrice.replace(',', '.'));
    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      Alert.alert('Precio inválido', 'Escribe un precio mayor que cero.');
      return;
    }
    setMenu((current) => current.map((item, itemIndex) => (
      itemIndex === editingMenuIndex ? { ...item, price: parsedPrice.toFixed(2) } : item
    )));
    setEditingMenuIndex(null);
  };

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>TU ESPACIO DE TRABAJO</Text>
          <Text style={styles.title}>Mi huarique</Text>
        </View>
        <View style={styles.statusBadge}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>Abierto</Text>
        </View>
      </View>

      <Card style={styles.businessCard}>
        <View style={styles.businessHeader}>
          <View style={styles.businessIcon}><Ionicons name="restaurant" size={23} color={colors.primary} /></View>
          <View style={styles.businessCopy}>
            <Text style={styles.businessName}>{businessName}</Text>
            <Text style={styles.businessLocation}>{category} · Surquillo</Text>
          </View>
          <Ionicons name="checkmark-circle" size={20} color={colors.success} />
        </View>
        <View style={styles.ratingRow}>
          <Text style={styles.rating}>4.9</Text>
          <Text style={styles.stars}>★★★★★</Text>
          <Text style={styles.ratingCaption}>142 reseñas</Text>
        </View>
      </Card>

      <View style={styles.sectionHeading}>
        <Text style={styles.sectionTitle}>Datos y perfil</Text>
        <Text style={styles.sectionHint}>Información visible para tus clientes</Text>
      </View>
      <Card style={styles.formCard}>
        <Field label="Nombre oficial del huarique" value={businessName} onChangeText={setBusinessName} icon="storefront-outline" />
        <Field label="Dirección y distrito" value={address} onChangeText={setAddress} icon="location-outline" />
        <Text style={styles.label}>Especialidad culinaria</Text>
        <View style={styles.chipRow}>
          {['Criolla', 'Cevichería', 'Sanguchería'].map((item) => {
            const selected = category === item;
            return (
              <TouchableOpacity
                key={item}
                style={[styles.categoryChip, selected && styles.categoryChipSelected]}
                onPress={() => setCategory(item)}
              >
                <Text style={[styles.categoryText, selected && styles.categoryTextSelected]}>{item}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </Card>

      <View style={styles.sectionHeading}>
        <Text style={styles.sectionTitle}>Atención y precios</Text>
        <Text style={styles.sectionHint}>Edita tus horarios y ticket promedio</Text>
      </View>
      <Card style={styles.formCard}>
        <View style={styles.twoFields}>
          <Field label="Días de apertura" value={days} onChangeText={setDays} style={styles.halfField} />
          <Field label="Horario promedio" value={hours} onChangeText={setHours} style={styles.halfField} />
        </View>
        <Field label="Ticket promedio por persona (S/)" value={ticket} onChangeText={setTicket} keyboardType="decimal-pad" icon="cash-outline" />
      </Card>

      <View style={styles.sectionHeading}>
        <Text style={styles.sectionTitle}>Fotos del huarique</Text>
        <Text style={styles.sectionHint}>Muestra el ambiente a tus visitantes</Text>
      </View>
      <View style={styles.photoRow}>
        <PhotoPlaceholder label="Fachada" icon="storefront-outline" />
        <PhotoPlaceholder label="Interior / mesas" icon="images-outline" />
        <TouchableOpacity style={styles.addPhoto} onPress={() => Alert.alert('Agregar foto', 'La selección de fotos estará disponible próximamente.')}>
          <Ionicons name="add" size={25} color={colors.primary} />
          <Text style={styles.addPhotoText}>Agregar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionHeading}>
        <Text style={styles.sectionTitle}>Tus platos estrella</Text>
        <Text style={styles.sectionHint}>{menu.length} de 2 platos destacados</Text>
      </View>
      {menu.map((item, index) => (
        <TouchableOpacity key={item.name} activeOpacity={0.85} onPress={() => editMenuItem(index)}>
          <Card style={styles.menuCard}>
            <View style={styles.menuIcon}><Ionicons name={item.icon} size={22} color={colors.primary} /></View>
            <View style={styles.menuCopy}>
              <Text style={styles.menuName}>{item.name}</Text>
              <Text style={styles.menuDescription}>{item.description}</Text>
            </View>
            <View style={styles.menuPriceWrap}>
              <Text style={styles.menuPrice}>S/ {item.price}</Text>
              <Ionicons name="pencil-outline" size={14} color={colors.primary} />
            </View>
          </Card>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.saveButton} onPress={saveChanges}>
        <Text style={styles.saveText}>Guardar cambios</Text>
        <Ionicons name="checkmark-circle-outline" size={19} color={colors.surface} />
      </TouchableOpacity>
      <Text style={styles.footerHint}>Los cambios se muestran aquí y no se publican en un servicio externo.</Text>

      <Modal
        visible={editingMenuIndex !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setEditingMenuIndex(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Editar precio</Text>
            <Text style={styles.modalSubtitle}>{menu[editingMenuIndex]?.name}</Text>
            <View style={styles.priceInputWrap}>
              <Text style={styles.currency}>S/</Text>
              <TextInput
                value={editingPrice}
                onChangeText={setEditingPrice}
                keyboardType="decimal-pad"
                style={styles.priceInput}
                accessibilityLabel="Precio del plato"
              />
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setEditingMenuIndex(null)}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSaveButton} onPress={saveMenuPrice}>
                <Text style={styles.modalSaveText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

function Field({ label, value, onChangeText, icon, keyboardType, style }) {
  return (
    <View style={[styles.field, style]}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrap}>
        {icon ? <Ionicons name={icon} size={16} color={colors.primary} /> : null}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          style={styles.input}
          placeholder={label}
          placeholderTextColor={colors.textSecondary}
          keyboardType={keyboardType || 'default'}
        />
      </View>
    </View>
  );
}

function PhotoPlaceholder({ label, icon }) {
  return (
    <TouchableOpacity
      style={styles.photoPlaceholder}
      onPress={() => Alert.alert(label, 'La selección de fotos estará disponible próximamente.')}
    >
      <Ionicons name={icon} size={24} color={colors.primary} />
      <Text style={styles.photoLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md },
  eyebrow: { color: colors.primary, fontFamily: typography.fontFamily.bold, fontSize: 10, letterSpacing: 1 },
  title: { color: colors.brownDark, fontFamily: typography.fontFamily.extraBold, fontSize: typography.fontSize.xl, marginTop: 2 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#EFF6DA', borderRadius: 20, paddingVertical: 7, paddingHorizontal: 10 },
  statusDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.success },
  statusText: { color: colors.success, fontFamily: typography.fontFamily.bold, fontSize: 10 },
  businessCard: { marginBottom: spacing.lg },
  businessHeader: { flexDirection: 'row', alignItems: 'center' },
  businessIcon: { width: 44, height: 44, borderRadius: 13, backgroundColor: colors.peach, alignItems: 'center', justifyContent: 'center', marginRight: spacing.sm },
  businessCopy: { flex: 1 },
  businessName: { color: colors.brownDark, fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.sm },
  businessLocation: { color: colors.textSecondary, fontFamily: typography.fontFamily.regular, fontSize: 11, marginTop: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: colors.border, marginTop: spacing.md, paddingTop: spacing.md, gap: 8 },
  rating: { color: colors.primary, fontFamily: typography.fontFamily.extraBold, fontSize: typography.fontSize.lg },
  stars: { color: '#E8590C', fontSize: 13, letterSpacing: 1 },
  ratingCaption: { color: colors.textSecondary, fontFamily: typography.fontFamily.regular, fontSize: 10, marginLeft: 'auto' },
  sectionHeading: { marginBottom: spacing.sm, marginTop: spacing.xs },
  sectionTitle: { color: colors.brownDark, fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.md },
  sectionHint: { color: colors.textSecondary, fontFamily: typography.fontFamily.regular, fontSize: 10, marginTop: 3 },
  formCard: { padding: spacing.md, marginBottom: spacing.md },
  field: { marginBottom: spacing.md },
  label: { color: colors.brownDark, fontFamily: typography.fontFamily.semiBold, fontSize: 10, marginBottom: 5 },
  inputWrap: { minHeight: 42, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, borderRadius: spacing.borderRadius.sm, backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.sm },
  input: { flex: 1, color: colors.brownDark, fontFamily: typography.fontFamily.regular, fontSize: 11, paddingVertical: 8 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  categoryChip: { paddingHorizontal: 11, paddingVertical: 8, borderRadius: 18, backgroundColor: colors.peach, borderWidth: 1, borderColor: colors.peach },
  categoryChipSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  categoryText: { color: colors.primary, fontFamily: typography.fontFamily.semiBold, fontSize: 10 },
  categoryTextSelected: { color: colors.surface },
  twoFields: { flexDirection: 'row', gap: spacing.sm },
  halfField: { flex: 1 },
  photoRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  photoPlaceholder: { flex: 1, minHeight: 98, borderRadius: spacing.borderRadius.md, backgroundColor: '#F8E3D5', alignItems: 'center', justifyContent: 'center', gap: 6 },
  photoLabel: { color: colors.brownDark, fontFamily: typography.fontFamily.semiBold, fontSize: 9, textAlign: 'center' },
  addPhoto: { width: 70, minHeight: 98, borderRadius: spacing.borderRadius.md, borderWidth: 1, borderStyle: 'dashed', borderColor: colors.primary, alignItems: 'center', justifyContent: 'center', gap: 3 },
  addPhotoText: { color: colors.primary, fontFamily: typography.fontFamily.semiBold, fontSize: 9 },
  menuCard: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, marginBottom: spacing.sm },
  menuIcon: { width: 44, height: 48, borderRadius: spacing.borderRadius.sm, backgroundColor: colors.peach, alignItems: 'center', justifyContent: 'center', marginRight: spacing.sm },
  menuCopy: { flex: 1 },
  menuName: { color: colors.brownDark, fontFamily: typography.fontFamily.bold, fontSize: 11 },
  menuDescription: { color: colors.textSecondary, fontFamily: typography.fontFamily.regular, fontSize: 9, lineHeight: 14, marginTop: 4 },
  menuPriceWrap: { alignItems: 'flex-end', gap: 6, marginLeft: spacing.xs },
  menuPrice: { color: colors.primary, fontFamily: typography.fontFamily.bold, fontSize: 11 },
  saveButton: { minHeight: 48, backgroundColor: colors.primary, borderRadius: spacing.borderRadius.md, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  saveText: { color: colors.surface, fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.sm },
  footerHint: { color: colors.textSecondary, fontFamily: typography.fontFamily.regular, fontSize: 9, lineHeight: 14, textAlign: 'center', marginTop: spacing.sm },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.42)', alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  modalCard: { width: '100%', maxWidth: 380, backgroundColor: colors.surface, borderRadius: spacing.borderRadius.xl, padding: spacing.lg },
  modalTitle: { color: colors.brownDark, fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.lg },
  modalSubtitle: { color: colors.textSecondary, fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.sm, marginTop: spacing.xs, marginBottom: spacing.md },
  priceInputWrap: { minHeight: 48, borderWidth: 1, borderColor: colors.border, borderRadius: spacing.borderRadius.md, flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md },
  currency: { color: colors.primary, fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.md, marginRight: spacing.sm },
  priceInput: { flex: 1, color: colors.brownDark, fontFamily: typography.fontFamily.semiBold, fontSize: typography.fontSize.md, paddingVertical: spacing.sm },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: spacing.sm, marginTop: spacing.lg },
  cancelButton: { minHeight: 42, justifyContent: 'center', paddingHorizontal: spacing.md },
  cancelText: { color: colors.textSecondary, fontFamily: typography.fontFamily.semiBold, fontSize: typography.fontSize.sm },
  modalSaveButton: { minHeight: 42, justifyContent: 'center', paddingHorizontal: spacing.lg, borderRadius: spacing.borderRadius.md, backgroundColor: colors.primary },
  modalSaveText: { color: colors.surface, fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.sm },
});
