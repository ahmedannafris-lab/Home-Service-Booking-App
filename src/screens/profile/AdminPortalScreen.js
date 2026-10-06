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
import { useAdmin } from '../../context/AdminContext';
import { colors, fontSizes, radius, shadows, spacing } from '../../theme';

export function AdminPortalScreen({ navigation }) {
  const { metrics } = useAdmin();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Go back"
          accessibilityRole="button"
          onPress={() => navigation.goBack()}
          style={styles.headerIconBtn}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>

        <Text style={styles.headerTitle}>Admin Portal</Text>

        <Pressable
          accessibilityLabel="Notifications"
          accessibilityRole="button"
          onPress={() =>
            navigation.navigate('AdminPlaceholder', {
              title: 'Notifications',
              description: 'You have no new critical system notifications at this time.',
            })
          }
          style={styles.headerIconBtn}
        >
          <View style={styles.bellWrapper}>
            <Ionicons name="notifications-outline" size={22} color={colors.text} />
            <View style={styles.notifBadge} />
          </View>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
            }}
            style={styles.avatar}
          />
          <View style={styles.profileDetails}>
            <Text style={styles.profileName}>Kamal kumara</Text>
            <Text style={styles.profilePhone}>0712347683</Text>
            <Text style={styles.profileEmail}>kamal@gmail.com</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={() =>
              navigation.navigate('AdminPlaceholder', {
                title: 'Edit Profile',
                description: 'Profile editing will allow updating admin name, contact details, and credentials.',
              })
            }
            hitSlop={8}
          >
            <Text style={styles.editLink}>Edit</Text>
          </Pressable>
        </View>

        {/* Section: Overview Metrics */}
        <Text style={styles.sectionTitle}>Overview Metrics</Text>
        <View style={styles.metricsGrid}>
          {/* Card 1: Total Users */}
          <View style={styles.metricCard}>
            <View style={styles.metricHeaderRow}>
              <Text style={styles.metricLabel}>Total Users</Text>
              <View style={styles.metricIconWrap}>
                <Ionicons name="people-outline" size={15} color={colors.textSecondary} />
              </View>
            </View>
            <Text style={styles.metricValue}>{metrics.totalUsers.toLocaleString()}</Text>
            <View style={styles.trendBadgeSuccess}>
              <Text style={styles.trendTextSuccess}>{metrics.usersTrend}</Text>
            </View>
          </View>

          {/* Card 2: Providers */}
          <View style={styles.metricCard}>
            <View style={styles.metricHeaderRow}>
              <Text style={styles.metricLabel}>Providers</Text>
              <View style={styles.metricIconWrap}>
                <Ionicons name="briefcase-outline" size={15} color={colors.textSecondary} />
              </View>
            </View>
            <Text style={styles.metricValue}>{metrics.totalProviders}</Text>
            <View style={styles.trendBadgeWarning}>
              <Text style={styles.trendTextWarning}>
                {metrics.pendingProviders} pending approval
              </Text>
            </View>
          </View>

          {/* Card 3: Bookings */}
          <View style={styles.metricCard}>
            <View style={styles.metricHeaderRow}>
              <Text style={styles.metricLabel}>Bookings</Text>
              <View style={styles.metricIconWrap}>
                <Ionicons name="calendar-outline" size={15} color={colors.textSecondary} />
              </View>
            </View>
            <Text style={styles.metricValue}>{metrics.bookings.toLocaleString()}</Text>
            <View style={styles.trendBadgeSuccess}>
              <Text style={styles.trendTextSuccess}>{metrics.bookingsTrend}</Text>
            </View>
          </View>

          {/* Card 4: Completed */}
          <View style={styles.metricCard}>
            <View style={styles.metricHeaderRow}>
              <Text style={styles.metricLabel}>Completed</Text>
              <View style={styles.metricIconWrap}>
                <Ionicons name="checkmark-circle-outline" size={15} color={colors.success} />
              </View>
            </View>
            <Text style={styles.metricValue}>{metrics.completed.toLocaleString()}</Text>
            <View style={styles.trendBadgeSuccess}>
              <Text style={styles.trendTextSuccess}>{metrics.completedRate}</Text>
            </View>
          </View>
        </View>

        {/* Section: Recent Activities */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Recent Activities</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() =>
              navigation.navigate('AdminPlaceholder', {
                title: 'Recent Activities',
                description: 'Full activity audit trail with detailed transaction logs and timeline filter.',
              })
            }
            hitSlop={8}
          >
            <Text style={styles.viewAllLink}>View All</Text>
          </Pressable>
        </View>

        {/* Activity Card 1 */}
        <View style={styles.activityCard}>
          <View style={styles.activityIconBox}>
            <Ionicons name="calendar" size={18} color={colors.primary} />
          </View>
          <View style={styles.activityBody}>
            <View style={styles.activityTitleRow}>
              <Text style={styles.activityTitle}>New Booking</Text>
              <View style={styles.activityTag}>
                <Text style={styles.activityTagText}>NEW BOOKING</Text>
              </View>
            </View>
            <Text style={styles.activityDesc}>Kasun Perera booked Plumbing Repair</Text>
            <Text style={styles.activityTime}>16 Oct 2026 • 10:30 AM</Text>
          </View>
        </View>

        {/* Activity Card 2 */}
        <View style={styles.activityCard}>
          <View style={styles.activityIconBox}>
            <Ionicons name="person-add" size={18} color={colors.primary} />
          </View>
          <View style={styles.activityBody}>
            <View style={styles.activityTitleRow}>
              <Text style={styles.activityTitle}>Provider Registration</Text>
              <View style={styles.activityTag}>
                <Text style={styles.activityTagText}>NEW PROVIDER</Text>
              </View>
            </View>
            <Text style={styles.activityDesc}>
              Silva Electrical Services registered as provider
            </Text>
            <Text style={styles.activityTime}>15 Oct 2026 • 02:00 PM</Text>
          </View>
        </View>

        {/* Quick Action Chips */}
        <View style={styles.chipsSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsRow}
          >
            <Pressable
              accessibilityRole="button"
              onPress={() => navigation.navigate('UserManagement')}
              style={({ pressed }) => [styles.actionChip, pressed && styles.chipPressed]}
            >
              <Text style={styles.actionChipText}>Manage user</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={() =>
                navigation.navigate('AdminPlaceholder', {
                  title: 'Manage Categories',
                  description: 'Category taxonomy, service scopes, and base rates management.',
                })
              }
              style={({ pressed }) => [styles.actionChip, pressed && styles.chipPressed]}
            >
              <Text style={styles.actionChipText}>Manage Categories</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={() => navigation.navigate('ServiceProviders')}
              style={({ pressed }) => [styles.actionChip, pressed && styles.chipPressed]}
            >
              <Text style={styles.actionChipText}>Manage providers</Text>
            </Pressable>
          </ScrollView>
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
  headerIconBtn: {
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
  bellWrapper: {
    position: 'relative',
  },
  notifBadge: {
    position: 'absolute',
    top: 1,
    right: 1,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.danger,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  profileCard: {
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
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primarySoft,
  },
  profileDetails: {
    flex: 1,
    marginLeft: spacing.md,
  },
  profileName: {
    fontSize: fontSizes.md,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  profilePhone: {
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
    marginBottom: 1,
  },
  profileEmail: {
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
  },
  editLink: {
    color: colors.primary,
    fontSize: fontSizes.sm,
    fontWeight: '600',
    paddingHorizontal: spacing.xs,
  },
  sectionTitle: {
    fontSize: fontSizes.md,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  viewAllLink: {
    color: colors.primary,
    fontSize: fontSizes.sm,
    fontWeight: '600',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  metricCard: {
    width: '48%',
    flexGrow: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  metricHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  metricLabel: {
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  metricIconWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricValue: {
    fontSize: fontSizes.xl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  trendBadgeSuccess: {
    alignSelf: 'flex-start',
    backgroundColor: colors.successSoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  trendTextSuccess: {
    color: colors.success,
    fontSize: fontSizes.xs,
    fontWeight: '600',
  },
  trendBadgeWarning: {
    alignSelf: 'flex-start',
    backgroundColor: colors.warningSoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  trendTextWarning: {
    color: colors.warning,
    fontSize: fontSizes.xs,
    fontWeight: '600',
  },
  activityCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    alignItems: 'flex-start',
    ...shadows.card,
  },
  activityIconBox: {
    width: 38,
    height: 38,
    borderRadius: radius.sm,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  activityBody: {
    flex: 1,
  },
  activityTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  activityTitle: {
    fontSize: fontSizes.sm,
    fontWeight: '700',
    color: colors.text,
  },
  activityTag: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  activityTagText: {
    color: colors.primary,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  activityDesc: {
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
    marginBottom: 4,
    lineHeight: 17,
  },
  activityTime: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  chipsSection: {
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  actionChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: '#CED8E2',
    ...shadows.subtle,
  },
  actionChipText: {
    fontSize: fontSizes.xs,
    fontWeight: '600',
    color: colors.text,
  },
  chipPressed: {
    backgroundColor: colors.muted,
  },
});
