import React from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../../components';
import { colors, fontSizes, radius, shadows, spacing } from '../../theme';

export function ProfileMainScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.headerWrap}>
        <Header title="Profile" />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Card */}
        <View style={styles.userCard}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
            }}
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>Kamal Kumara</Text>
            <Text style={styles.userRole}>System Administrator</Text>
            <Text style={styles.userEmail}>kamal@gmail.com</Text>
          </View>
        </View>

        {/* Administration Section */}
        <Text style={styles.sectionHeader}>Management & Operations</Text>

        {/* Admin Portal Entry */}
        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.navigate('AdminPortal')}
          style={({ pressed }) => [styles.adminPortalCard, pressed && styles.cardPressed]}
        >
          <View style={styles.adminIconBox}>
            <Ionicons name="shield-checkmark" size={24} color={colors.white} />
          </View>
          <View style={styles.adminCardText}>
            <View style={styles.badgeRow}>
              <Text style={styles.adminTitle}>Admin Portal</Text>
              <View style={styles.adminBadge}>
                <Text style={styles.adminBadgeText}>PORTAL</Text>
              </View>
            </View>
            <Text style={styles.adminSubtitle}>
              Manage users, service providers & platform metrics
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.primary} />
        </Pressable>

        {/* Other Profile Options */}
        <Text style={styles.sectionHeader}>Account & Preferences</Text>

        <View style={styles.menuGroup}>
          <Pressable
            accessibilityRole="button"
            onPress={() =>
              navigation.navigate('AdminPlaceholder', {
                title: 'Account Settings',
                description: 'Manage personal details, password security, and two-factor authentication.',
              })
            }
            style={styles.menuItem}
          >
            <View style={styles.menuIconBox}>
              <Ionicons name="person-outline" size={20} color={colors.primary} />
            </View>
            <Text style={styles.menuTitle}>Account Settings</Text>
            <Ionicons name="chevron-forward" size={18} color="#A0AEC0" />
          </Pressable>

          <View style={styles.menuDivider} />

          <Pressable
            accessibilityRole="button"
            onPress={() =>
              navigation.navigate('AdminPlaceholder', {
                title: 'Notification Preferences',
                description: 'Configure real-time push alerts, booking updates, and SMS notifications.',
              })
            }
            style={styles.menuItem}
          >
            <View style={styles.menuIconBox}>
              <Ionicons name="notifications-outline" size={20} color={colors.primary} />
            </View>
            <Text style={styles.menuTitle}>Notification Preferences</Text>
            <Ionicons name="chevron-forward" size={18} color="#A0AEC0" />
          </Pressable>

          <View style={styles.menuDivider} />

          <Pressable
            accessibilityRole="button"
            onPress={() =>
              navigation.navigate('AdminPlaceholder', {
                title: 'Help & Support',
                description: 'Access the documentation, customer support desk, and system guidelines.',
              })
            }
            style={styles.menuItem}
          >
            <View style={styles.menuIconBox}>
              <Ionicons name="help-circle-outline" size={20} color={colors.primary} />
            </View>
            <Text style={styles.menuTitle}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={18} color="#A0AEC0" />
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerWrap: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl,
    ...shadows.card,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.primarySoft,
  },
  userInfo: {
    flex: 1,
    marginLeft: spacing.md,
    gap: 2,
  },
  userName: {
    fontSize: fontSizes.lg,
    fontWeight: '700',
    color: colors.text,
  },
  userRole: {
    fontSize: fontSizes.xs,
    color: colors.primary,
    fontWeight: '600',
  },
  userEmail: {
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
  },
  sectionHeader: {
    fontSize: fontSizes.xs,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  adminPortalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.primarySoft,
    marginBottom: spacing.xl,
    ...shadows.raised,
  },
  cardPressed: {
    opacity: 0.88,
  },
  adminIconBox: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  adminCardText: {
    flex: 1,
    gap: 3,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  adminTitle: {
    fontSize: fontSizes.md,
    fontWeight: '700',
    color: colors.text,
  },
  adminBadge: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  adminBadgeText: {
    color: colors.primary,
    fontSize: 9,
    fontWeight: '700',
  },
  adminSubtitle: {
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  menuGroup: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadows.card,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  menuTitle: {
    flex: 1,
    fontSize: fontSizes.sm,
    fontWeight: '600',
    color: colors.text,
  },
  menuDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginLeft: 56,
  },
});
