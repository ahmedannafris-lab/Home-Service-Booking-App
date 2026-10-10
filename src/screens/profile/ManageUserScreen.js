import React, { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAdmin } from '../../context/AdminContext';
import { ConfirmModal } from '../../components/ConfirmModal';
import { colors, fontSizes, radius, shadows, spacing } from '../../theme';

export function ManageUserScreen({ navigation, route }) {
  const { userId } = route.params || {};
  const { getUserById, updateUserStatus } = useAdmin();

  const user = getUserById(userId) || {
    id: 'usr-01',
    code: 'USR 1024',
    name: 'Kamal Perera',
    email: 'kamalperera@gmail.com',
    phone: '0712347683',
    status: 'active',
    activeSince: '12 Aug 2026 - 10:00 AM',
    address: 'No 24, Rajapihilla Rd, Kurunegala',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  };

  const [suspendModalVisible, setSuspendModalVisible] = useState(false);
  const [successBanner, setSuccessBanner] = useState('');

  const isActive = user.status === 'active';

  const handleActivate = () => {
    updateUserStatus(user.id, 'active');
    setSuccessBanner('User account activated successfully.');
    setTimeout(() => setSuccessBanner(''), 2500);
  };

  const handleConfirmSuspend = () => {
    updateUserStatus(user.id, 'inactive');
    setSuspendModalVisible(false);
    setSuccessBanner('User account has been suspended.');
    setTimeout(() => setSuccessBanner(''), 2500);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Go back"
          accessibilityRole="button"
          onPress={() => navigation.goBack()}
          style={styles.headerBackBtn}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Manage User</Text>
        <View style={styles.headerRightSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Success toast if updated */}
        {successBanner ? (
          <View style={styles.toastBanner}>
            <Ionicons name="checkmark-circle" size={16} color={colors.success} />
            <Text style={styles.toastText}>{successBanner}</Text>
          </View>
        ) : null}

        {/* Section 1: User Details */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>User Details</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() =>
              navigation.navigate('AdminPlaceholder', {
                title: 'Edit User',
                description: `Edit contact information and profile details for ${user.name}.`,
              })
            }
            hitSlop={8}
          >
            <Text style={styles.editLink}>Edit</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <View style={styles.userRow}>
            <Image
              source={{
                uri:
                  user.avatar ||
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
              }}
              style={styles.avatar}
            />
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.contactText}>{user.email}</Text>
              <Text style={styles.contactText}>{user.phone}</Text>
            </View>
          </View>
        </View>

        {/* Section 2: Account Status */}
        <Text style={styles.sectionTitle}>Account Status</Text>
        {isActive ? (
          <View style={styles.statusCardActive}>
            <Ionicons name="checkmark-circle" size={18} color={colors.success} />
            <Text style={styles.statusTextActive}>
              Active since {user.activeSince || '12 Aug 2026 - 10:00 AM'}
            </Text>
          </View>
        ) : (
          <View style={styles.statusCardInactive}>
            <Ionicons name="alert-circle-outline" size={18} color={colors.textSecondary} />
            <Text style={styles.statusTextInactive}>Inactive</Text>
          </View>
        )}

        {/* Section 3: Assigned Branch & Address */}
        <Text style={styles.sectionTitle}>Assigned Branch & Address</Text>
        <View style={styles.card}>
          <View style={styles.addressRow}>
            <View style={styles.addressIconBox}>
              <Ionicons name="location-outline" size={18} color={colors.primary} />
            </View>
            <Text style={styles.addressText}>
              {user.address || 'No 24, Rajapihilla Rd, Kurunegala'}
            </Text>
          </View>
        </View>

        {/* Info Note */}
        <View style={styles.infoNoteRow}>
          <Ionicons
            name="information-circle-outline"
            size={15}
            color={colors.textSecondary}
            style={styles.infoIcon}
          />
          <Text style={styles.infoNoteText}>
            Tapping Suspend Account will prompt confirmation before access is restricted.
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            onPress={handleActivate}
            style={({ pressed }) => [styles.activateBtn, pressed && styles.pressed]}
          >
            <Text style={styles.activateBtnText}>Activate / Update</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={() => setSuspendModalVisible(true)}
            style={({ pressed }) => [styles.suspendBtn, pressed && styles.pressed]}
          >
            <Text style={styles.suspendBtnText}>Suspend Account</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Suspend Confirmation Modal */}
      <ConfirmModal
        visible={suspendModalVisible}
        title="Suspend Account"
        message={`Are you sure you want to suspend the account for ${user.name}? Access will be restricted.`}
        confirmText="Suspend Account"
        confirmVariant="danger"
        onConfirm={handleConfirmSuspend}
        onCancel={() => setSuspendModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerBackBtn: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: fontSizes.lg,
    fontWeight: '700',
    color: colors.text,
  },
  headerRightSpacer: {
    width: 38,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
  },
  toastBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.successSoft,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
  },
  toastText: {
    fontSize: fontSizes.xs,
    color: colors.success,
    fontWeight: '600',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    fontSize: fontSizes.sm,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  editLink: {
    color: colors.primary,
    fontSize: fontSizes.sm,
    fontWeight: '600',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xs,
    ...shadows.card,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primarySoft,
    marginRight: spacing.md,
  },
  userDetails: {
    flex: 1,
    gap: 2,
  },
  userName: {
    fontSize: fontSizes.sm,
    fontWeight: '700',
    color: colors.text,
  },
  contactText: {
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
  },
  statusCardActive: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: '#EDFAF4',
    borderWidth: 1,
    borderColor: '#C6EFE0',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginBottom: spacing.xs,
  },
  statusTextActive: {
    fontSize: fontSizes.xs,
    color: colors.success,
    fontWeight: '600',
  },
  statusCardInactive: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.muted,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginBottom: spacing.xs,
  },
  statusTextInactive: {
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  addressIconBox: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressText: {
    fontSize: fontSizes.xs,
    fontWeight: '500',
    color: colors.text,
    flex: 1,
  },
  infoNoteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    paddingHorizontal: 2,
  },
  infoIcon: {
    marginTop: 1,
  },
  infoNoteText: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 16,
    flex: 1,
  },
  actions: {
    gap: spacing.md,
  },
  activateBtn: {
    minHeight: 48,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
  },
  activateBtnText: {
    color: colors.white,
    fontSize: fontSizes.md,
    fontWeight: '700',
  },
  suspendBtn: {
    minHeight: 46,
    backgroundColor: colors.dangerSoft,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  suspendBtnText: {
    color: colors.danger,
    fontSize: fontSizes.md,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.85,
  },
});
