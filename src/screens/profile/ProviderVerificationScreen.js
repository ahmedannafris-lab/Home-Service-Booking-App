import React, { useState } from 'react';
import {
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

export function ProviderVerificationScreen({ navigation, route }) {
  const { providerId } = route.params || {};
  const { getProviderById, approveProvider, rejectProvider } = useAdmin();
  const provider = getProviderById(providerId) || {
    id: 'pro-01',
    businessName: 'Kasun Plumbing Services',
    email: 'kasunplumbing@gmail.com',
    phone: '0712547723',
    scope: 'Residential & Commercial Plumbing',
    status: 'pending',
    submittedDate: '12 Aug 2026',
    referenceNo: 'VR-8492',
    feePaid: true,
    feeAmount: 'LKR 1,000',
    icon: 'water-outline',
  };

  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [feeErrorVisible, setFeeErrorVisible] = useState(false);

  const handleApprove = () => {
    if (!provider.feePaid) {
      setFeeErrorVisible(true);
      return;
    }
    approveProvider(provider.id);
    navigation.goBack();
  };

  const handleConfirmReject = () => {
    rejectProvider(provider.id);
    setRejectModalVisible(false);
    navigation.goBack();
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
        <Text style={styles.headerTitle}>Provider Verification</Text>
        <View style={styles.headerRightSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Section 1: Provider Details */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Provider Details</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() =>
              navigation.navigate('AdminPlaceholder', {
                title: 'Edit Provider',
                description: `Edit contact information and business profile for ${provider.businessName}.`,
              })
            }
            hitSlop={8}
          >
            <Text style={styles.editLink}>Edit</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <View style={styles.providerRow}>
            <View style={styles.logoBox}>
              <Ionicons
                name={provider.icon || 'construct-outline'}
                size={22}
                color={colors.primary}
              />
            </View>
            <View style={styles.providerDetails}>
              <Text style={styles.businessName}>{provider.businessName}</Text>
              <Text style={styles.contactText}>{provider.email}</Text>
              <Text style={styles.contactText}>{provider.phone}</Text>
            </View>
          </View>
        </View>

        {/* Section 2: Category & Scope */}
        <Text style={styles.sectionTitle}>Category & Scope</Text>
        <View style={styles.card}>
          <View style={styles.scopeRow}>
            <View style={styles.scopeIconBox}>
              <Ionicons name="briefcase-outline" size={18} color={colors.primary} />
            </View>
            <Text style={styles.scopeText}>{provider.scope}</Text>
          </View>
        </View>

        {/* Section 3: Verification Status */}
        <Text style={styles.sectionTitle}>Verification Status</Text>
        <View style={styles.card}>
          {provider.status === 'pending' ? (
            <View style={styles.statusBadgeWarning}>
              <View style={styles.dotWarning} />
              <Text style={styles.statusBadgeWarningText}>Pending Admin Review</Text>
            </View>
          ) : provider.status === 'verified' ? (
            <View style={styles.statusBadgeSuccess}>
              <Ionicons name="checkmark-circle" size={14} color={colors.success} />
              <Text style={styles.statusBadgeSuccessText}>Verified</Text>
            </View>
          ) : (
            <View style={styles.statusBadgeDanger}>
              <Ionicons name="close-circle" size={14} color={colors.danger} />
              <Text style={styles.statusBadgeDangerText}>Rejected</Text>
            </View>
          )}

          <Text style={styles.submittedInfo}>
            Submitted {provider.submittedDate} • Reference #{provider.referenceNo}
          </Text>

          <View style={styles.divider} />

          <View style={styles.checklist}>
            <View style={styles.checkItem}>
              <Ionicons name="checkmark-circle" size={16} color={colors.success} />
              <Text style={styles.checkText}>Identity Document Verified</Text>
            </View>
            <View style={styles.checkItem}>
              <Ionicons name="checkmark-circle" size={16} color={colors.success} />
              <Text style={styles.checkText}>Business Registration & Scope</Text>
            </View>
            <View style={styles.checkItem}>
              <Ionicons name="checkmark-circle" size={16} color={colors.success} />
              <Text style={styles.checkText}>Contact & Location Confirmed</Text>
            </View>
          </View>
        </View>

        {/* Section 4: Fee Banner */}
        {provider.feePaid ? (
          <View style={styles.feeBannerSuccess}>
            <Ionicons name="checkmark-circle" size={20} color={colors.success} />
            <Text style={styles.feeBannerSuccessText}>
              Verification fee paid {provider.feeAmount || 'LKR 1,000'}
            </Text>
            <View style={styles.paidBadge}>
              <Text style={styles.paidBadgeText}>PAID</Text>
            </View>
          </View>
        ) : (
          <View style={styles.feeBannerWarning}>
            <Ionicons name="alert-circle" size={20} color={colors.warning} />
            <Text style={styles.feeBannerWarningText}>Verification fee not paid</Text>
            <View style={styles.unpaidBadge}>
              <Text style={styles.unpaidBadgeText}>UNPAID</Text>
            </View>
          </View>
        )}

        {/* Buttons */}
        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            onPress={handleApprove}
            style={({ pressed }) => [styles.approveBtn, pressed && styles.pressed]}
          >
            <Ionicons name="checkmark" size={20} color={colors.white} />
            <Text style={styles.approveBtnText}>Approve Provider</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={() => setRejectModalVisible(true)}
            style={({ pressed }) => [styles.rejectBtn, pressed && styles.pressed]}
          >
            <Ionicons name="close" size={18} color={colors.danger} />
            <Text style={styles.rejectBtnText}>Reject Application</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Reject Confirmation Modal */}
      <ConfirmModal
        visible={rejectModalVisible}
        title="Reject Application"
        message={`Are you sure you want to reject the application for ${provider.businessName}?`}
        confirmText="Reject"
        confirmVariant="danger"
        onConfirm={handleConfirmReject}
        onCancel={() => setRejectModalVisible(false)}
      />

      {/* Unpaid Fee Alert Modal */}
      <ConfirmModal
        visible={feeErrorVisible}
        title="Cannot Approve"
        message="The verification fee has not been paid. Providers cannot be approved without completing payment."
        confirmText="Understood"
        confirmVariant="primary"
        cancelText="Close"
        onConfirm={() => setFeeErrorVisible(false)}
        onCancel={() => setFeeErrorVisible(false)}
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
  providerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBox: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  providerDetails: {
    flex: 1,
    gap: 2,
  },
  businessName: {
    fontSize: fontSizes.sm,
    fontWeight: '700',
    color: colors.text,
  },
  contactText: {
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
  },
  scopeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  scopeIconBox: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scopeText: {
    fontSize: fontSizes.xs,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  statusBadgeWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: colors.warningSoft,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: radius.pill,
    marginBottom: 6,
  },
  dotWarning: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.warning,
  },
  statusBadgeWarningText: {
    fontSize: fontSizes.xs,
    fontWeight: '700',
    color: colors.warning,
  },
  statusBadgeSuccess: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: colors.successSoft,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: radius.pill,
    marginBottom: 6,
  },
  statusBadgeSuccessText: {
    fontSize: fontSizes.xs,
    fontWeight: '700',
    color: colors.success,
  },
  statusBadgeDanger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: colors.dangerSoft,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: radius.pill,
    marginBottom: 6,
  },
  statusBadgeDangerText: {
    fontSize: fontSizes.xs,
    fontWeight: '700',
    color: colors.danger,
  },
  submittedInfo: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  checklist: {
    gap: spacing.sm,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  checkText: {
    fontSize: fontSizes.xs,
    color: colors.text,
    fontWeight: '500',
  },
  feeBannerSuccess: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDFAF4',
    borderWidth: 1,
    borderColor: '#C6EFE0',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  feeBannerSuccessText: {
    flex: 1,
    fontSize: fontSizes.xs,
    fontWeight: '700',
    color: colors.success,
  },
  paidBadge: {
    backgroundColor: '#DEF4E8',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
  },
  paidBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.success,
  },
  feeBannerWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warningSoft,
    borderWidth: 1,
    borderColor: '#FEE5B3',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  feeBannerWarningText: {
    flex: 1,
    fontSize: fontSizes.xs,
    fontWeight: '700',
    color: colors.warning,
  },
  unpaidBadge: {
    backgroundColor: '#FDE4B0',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
  },
  unpaidBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.warning,
  },
  actions: {
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  approveBtn: {
    minHeight: 48,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    ...shadows.card,
  },
  approveBtnText: {
    color: colors.white,
    fontSize: fontSizes.md,
    fontWeight: '700',
  },
  rejectBtn: {
    minHeight: 46,
    backgroundColor: colors.dangerSoft,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  rejectBtnText: {
    color: colors.danger,
    fontSize: fontSizes.md,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.85,
  },
});
