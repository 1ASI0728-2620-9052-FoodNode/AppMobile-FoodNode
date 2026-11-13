import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../../shared/interfaces/ui/ScreenContainer.jsx';
import { Button } from '../../../shared/interfaces/ui/Button.jsx';
import { Card } from '../../../shared/interfaces/ui/Card.jsx';
import { colors } from '../../../shared/interfaces/theme/colors.js';
import { typography } from '../../../shared/interfaces/theme/typography.js';
import { spacing } from '../../../shared/interfaces/theme/spacing.js';
import { Roles } from '../domain/Role.js';
import { useDependencies } from '../../../app/providers/DependencyProvider.jsx';
import { useAuthContext } from './AuthProvider.jsx';
import { DEMO_MODE } from '../../../shared/demo/demoMode.js';

const ROLE_DISPLAY = {
  [Roles.GASTRONOMIC_EXPLORER]: 'Explorador Gastronómico',
  [Roles.HUARIQUE_OWNER]: 'Dueño de Huarique',
};

export function ProfileScreen() {
  const { user, logout, isLoading: authLoading } = useAuthContext();
  const deps = useDependencies();
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (DEMO_MODE) {
      return undefined;
    }

    let cancelled = false;
    (async () => {
      try {
        const session = await deps.iam.restoreSessionHandler.execute();
        if (session && !cancelled) {
          const userData = await deps.iam.getCurrentUserHandler.execute(session.token);
          if (!cancelled) setProfile(userData);
        }
      } catch {
        // fall back to local user state
      } finally {
        if (!cancelled) setLoadingProfile(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const displayUser = profile || user || (DEMO_MODE ? {
    name: 'Explorador Foodly',
    email: 'demo@foodly.app',
    username: 'explorador',
    role: Roles.GASTRONOMIC_EXPLORER,
  } : null);

  if (!DEMO_MODE && loadingProfile && !displayUser) {
    return (
      <ScreenContainer>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.container}>
        {/* Avatar */}
        <View style={styles.avatarWrap}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color={colors.surface} />
          </View>
        </View>

        {/* User Info Card */}
        <Card style={styles.infoCard}>
          <InfoRow icon="person-outline" label="Nombre" value={displayUser?.name || '—'} />
          <InfoRow icon="mail-outline" label="Correo" value={displayUser?.email || '—'} />
          <InfoRow icon="at-outline" label="Usuario" value={displayUser?.username ? `@${displayUser.username}` : '—'} />
          <InfoRow
            icon="shield-checkmark-outline"
            label="Rol"
            value={ROLE_DISPLAY[displayUser?.role] || displayUser?.role || '—'}
            last
          />
        </Card>

        {/* Logout */}
        {DEMO_MODE ? (
          <View style={styles.demoNote}>
            <Ionicons name="sparkles-outline" size={18} color={colors.primary} />
            <Text style={styles.demoNoteText}>Estás explorando Foodly en modo demo.</Text>
          </View>
        ) : (
          <Button
            title="Cerrar sesión"
            variant="outline"
            onPress={logout}
            loading={authLoading}
            icon={<Ionicons name="log-out-outline" size={20} color={colors.primary} />}
          />
        )}
      </View>
    </ScreenContainer>
  );
}

function InfoRow({ icon, label, value, last }) {
  return (
    <View style={[styles.infoRow, !last && styles.infoRowBorder]}>
      <Ionicons name={icon} size={20} color={colors.primary} style={styles.infoIcon} />
      <View style={styles.infoText}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.xxl,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Avatar */
  avatarWrap: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Info card */
  infoCard: {
    marginBottom: spacing.xxl,
  },
  demoNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: spacing.borderRadius.md,
    backgroundColor: colors.peach,
  },
  demoNoteText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.sm,
    color: colors.brownDark,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  infoRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoIcon: {
    marginRight: spacing.md,
  },
  infoText: {
    flex: 1,
  },
  infoLabel: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.md,
    color: colors.textPrimary,
  },
});
