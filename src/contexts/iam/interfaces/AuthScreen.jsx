import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../../shared/interfaces/ui/ScreenContainer.jsx';
import { Button } from '../../../shared/interfaces/ui/Button.jsx';
import { Chip } from '../../../shared/interfaces/ui/Chip.jsx';
import { Card } from '../../../shared/interfaces/ui/Card.jsx';
import { colors } from '../../../shared/interfaces/theme/colors.js';
import { typography } from '../../../shared/interfaces/theme/typography.js';
import { spacing } from '../../../shared/interfaces/theme/spacing.js';
import { Roles } from '../domain/Role.js';
import { useAuthContext } from './AuthProvider.jsx';

const ROLE_LABELS = {
  [Roles.GASTRONOMIC_EXPLORER]: 'Explorador',
  [Roles.HUARIQUE_OWNER]: 'Dueño Huarique',
};

export function AuthScreen() {
  const { register, login, isLoading, error: authError, clearError } = useAuthContext();

  const [isRegister, setIsRegister] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState(Roles.GASTRONOMIC_EXPLORER);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [promoChecked, setPromoChecked] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [usernameSuffix, setUsernameSuffix] = useState(0);

  const generateUsername = useCallback(
    (emailStr, suffix) => {
      const local = emailStr.split('@')[0] || '';
      return suffix > 0 ? `${local}${suffix}` : local;
    },
    [],
  );

  const validate = useCallback(() => {
    const errors = {};

    // Email validation
    if (!email.trim()) {
      errors.email = 'El correo electrónico es requerido';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        errors.email = 'Correo electrónico inválido';
      }
    }

    // Password validation
    if (!password) {
      errors.password = 'La contraseña es requerida';
    } else if (password.length < 8) {
      errors.password = 'La contraseña debe tener al menos 8 caracteres';
    }

    // Confirm password (register only)
    if (isRegister) {
      if (!confirmPassword) {
        errors.confirmPassword = 'Confirma tu contraseña';
      } else if (password !== confirmPassword) {
        errors.confirmPassword = 'Las contraseñas no coinciden';
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }, [email, password, confirmPassword, isRegister]);

  const handleSubmit = useCallback(async () => {
    if (!validate()) return;
    clearError();

    try {
      if (isRegister) {
        const username = generateUsername(email, usernameSuffix);
        await register({ email: email.trim(), password, name: '', username, role });
      } else {
        await login({ email: email.trim(), password });
      }
    } catch (err) {
      // Handle 409 conflict — username taken, retry with numeric suffix
      if (err.response?.status === 409 && isRegister) {
        const nextSuffix = usernameSuffix + 1;
        setUsernameSuffix(nextSuffix);
        try {
          const username = generateUsername(email, nextSuffix);
          await register({ email: email.trim(), password, name: '', username, role });
        } catch (_retryErr) {
          // error already set by useAuth
        }
      }
    }
  }, [email, password, confirmPassword, role, isRegister, usernameSuffix, validate]);

  const handleGooglePress = useCallback(() => {
    if (Platform.OS === 'web') {
      alert('Próximamente');
    } else {
      Alert.alert('Próximamente', 'El inicio de sesión con Google estará disponible pronto.');
    }
  }, []);

  const toggleMode = useCallback(() => {
    setIsRegister((prev) => !prev);
    setFieldErrors({});
    clearError();
    setConfirmPassword('');
  }, []);

  return (
    <ScreenContainer scrollable>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <View style={styles.container}>
          {/* ── Logo & Branding ── */}
          <View style={styles.brandSection}>
            <View style={styles.logoCircle}>
              <Ionicons name="restaurant" size={32} color={colors.surface} />
            </View>
            <Text style={styles.appName}>Foodly</Text>
            <Text style={styles.tagline}>SABOR & TRADICIÓN LIMEÑA</Text>
            <Text style={styles.subtitle}>
              Descubre los huariques más auténticos de Lima, recomendados por la comunidad criolla.
            </Text>
          </View>

          {/* ── Role Selector (register only) ── */}
          {isRegister && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>¿CÓMO DESEAS PARTICIPAR?</Text>
              <View style={styles.chipRow}>
                <Chip
                  label={ROLE_LABELS[Roles.GASTRONOMIC_EXPLORER]}
                  selected={role === Roles.GASTRONOMIC_EXPLORER}
                  onPress={() => setRole(Roles.GASTRONOMIC_EXPLORER)}
                />
                <Chip
                  label={ROLE_LABELS[Roles.HUARIQUE_OWNER]}
                  selected={role === Roles.HUARIQUE_OWNER}
                  onPress={() => setRole(Roles.HUARIQUE_OWNER)}
                />
              </View>
            </View>
          )}

          {/* ── Form ── */}
          <View style={styles.formSection}>
            {/* Email */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Correo Electrónico</Text>
              <View style={[styles.inputWrap, fieldErrors.email && styles.inputError]}>
                <Ionicons name="mail-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="tu@correo.com"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  value={email}
                  onChangeText={(t) => {
                    setEmail(t);
                    if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                />
              </View>
              {fieldErrors.email && <Text style={styles.errorText}>{fieldErrors.email}</Text>}
            </View>

            {/* Password */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Contraseña</Text>
              <View style={[styles.inputWrap, fieldErrors.password && styles.inputError]}>
                <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Mínimo 8 caracteres"
                  placeholderTextColor={colors.textSecondary}
                  secureTextEntry={!showPassword}
                  autoComplete="password"
                  value={password}
                  onChangeText={(t) => {
                    setPassword(t);
                    if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                />
                <TouchableOpacity onPress={() => setShowPassword((v) => !v)} hitSlop={8}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={22}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
              {fieldErrors.password && <Text style={styles.errorText}>{fieldErrors.password}</Text>}
            </View>

            {/* Confirm Password (register only) */}
            {isRegister && (
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Confirmar Contraseña</Text>
                <View style={[styles.inputWrap, fieldErrors.confirmPassword && styles.inputError]}>
                  <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Repite tu contraseña"
                    placeholderTextColor={colors.textSecondary}
                    secureTextEntry={!showConfirm}
                    value={confirmPassword}
                    onChangeText={(t) => {
                      setConfirmPassword(t);
                      if (fieldErrors.confirmPassword) setFieldErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                    }}
                  />
                  <TouchableOpacity onPress={() => setShowConfirm((v) => !v)} hitSlop={8}>
                    <Ionicons
                      name={showConfirm ? 'eye-off-outline' : 'eye-outline'}
                      size={22}
                      color={colors.textSecondary}
                    />
                  </TouchableOpacity>
                </View>
                {fieldErrors.confirmPassword && (
                  <Text style={styles.errorText}>{fieldErrors.confirmPassword}</Text>
                )}
              </View>
            )}

            {/* Promo checkbox (register only) */}
            {isRegister && (
              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => setPromoChecked((v) => !v)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={promoChecked ? 'checkbox' : 'square-outline'}
                  size={22}
                  color={promoChecked ? colors.primary : colors.textSecondary}
                />
                <Text style={styles.checkboxLabel}>
                  Acceso a promociones y cartas secretas de huariques.
                </Text>
              </TouchableOpacity>
            )}

            {/* Auth error */}
            {authError && (
              <View style={styles.authErrorWrap}>
                <Ionicons name="alert-circle" size={18} color={colors.danger} />
                <Text style={styles.authErrorText}>{authError}</Text>
              </View>
            )}

            {/* Submit Button */}
            <Button
              title={isRegister ? 'Registrarse en Foodly' : 'Iniciar Sesión'}
              onPress={handleSubmit}
              loading={isLoading}
              icon={
                <Ionicons
                  name={isRegister ? 'arrow-forward' : 'log-in-outline'}
                  size={20}
                  color={colors.surface}
                />
              }
            />
          </View>

          {/* ── Divider ── */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>O CONTINÚA CON</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* ── Google ── */}
          <Button
            title="Continuar con Google"
            variant="outline"
            onPress={handleGooglePress}
            icon={<Ionicons name="logo-google" size={20} color={colors.primary} />}
          />

          {/* ── Toggle mode link ── */}
          <TouchableOpacity onPress={toggleMode} style={styles.toggleWrap}>
            <Text style={styles.toggleText}>
              {isRegister
                ? '¿Ya tienes cuenta? '
                : '¿No tienes cuenta? '}
              <Text style={styles.toggleLink}>
                {isRegister ? 'Inicia sesión' : 'Regístrate'}
              </Text>
            </Text>
          </TouchableOpacity>

          {/* ── Bottom Community Card ── */}
          <Card style={styles.communityCard}>
            <View style={styles.communityRow}>
              <View style={styles.communityIconWrap}>
                <Ionicons name="checkmark-circle" size={24} color={colors.success} />
              </View>
              <View style={styles.communityTextWrap}>
                <Text style={styles.communityTitle}>Comunidad Criolla Auténtica</Text>
                <Text style={styles.communitySubtitle}>
                  Más de 200 huariques verificados en Surquillo
                </Text>
              </View>
            </View>
          </Card>
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    paddingBottom: spacing.xxl,
  },

  /* Brand */
  brandSection: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
    marginTop: spacing.xl,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  appName: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: typography.fontSize.xxl,
    color: colors.brownDark,
    marginBottom: spacing.xs,
  },
  tagline: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.xs,
    color: colors.primary,
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
    lineHeight: 20,
  },

  /* Role selector */
  section: {
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  chipRow: {
    flexDirection: 'row',
  },

  /* Form */
  formSection: {
    marginBottom: spacing.lg,
  },
  fieldGroup: {
    marginBottom: spacing.md,
  },
  fieldLabel: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: spacing.borderRadius.md,
    paddingHorizontal: spacing.md,
    minHeight: 52,
  },
  inputError: {
    borderColor: colors.danger,
  },
  inputIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.md,
    color: colors.textPrimary,
    paddingVertical: spacing.sm,
  },
  errorText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.xs,
    color: colors.danger,
    marginTop: spacing.xs,
  },

  /* Checkbox */
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  checkboxLabel: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
    flex: 1,
  },

  /* Auth error */
  authErrorWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.peach,
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: spacing.borderRadius.sm,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  authErrorText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.danger,
    marginLeft: spacing.sm,
    flex: 1,
  },

  /* Divider */
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginHorizontal: spacing.md,
    letterSpacing: 1,
  },

  /* Toggle */
  toggleWrap: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  toggleText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  toggleLink: {
    fontFamily: typography.fontFamily.bold,
    color: colors.primary,
  },

  /* Community card */
  communityCard: {
    marginTop: spacing.xxl,
  },
  communityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  communityIconWrap: {
    marginRight: spacing.md,
  },
  communityTextWrap: {
    flex: 1,
  },
  communityTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  communitySubtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
});
