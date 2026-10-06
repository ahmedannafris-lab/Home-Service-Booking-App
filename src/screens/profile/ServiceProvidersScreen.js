import React, { useState, useMemo } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAdmin } from '../../context/AdminContext';
import { colors, fontSizes, radius, shadows, spacing } from '../../theme';

export function ServiceProvidersScreen({ navigation }) {
  const { providers } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'verified' | 'pending'

  const filteredProviders = useMemo(() => {
    return providers.filter((item) => {
      const matchesStatus =
        statusFilter === 'all' || item.status === statusFilter;

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        (item.businessName && item.businessName.toLowerCase().includes(q)) ||
        (item.category && item.category.toLowerCase().includes(q)) ||
        (item.name && item.name.toLowerCase().includes(q));

      return matchesStatus && matchesSearch;
    });
  }, [providers, statusFilter, searchQuery]);

  const renderProviderIcon = (iconName) => {
    return (
      <View style={styles.providerLogoBox}>
        <Ionicons name={iconName || 'construct-outline'} size={22} color={colors.primary} />
      </View>
    );
  };

  const renderStatusBadge = (status) => {
    if (status === 'verified') {
      return (
        <View style={styles.badgeVerified}>
          <View style={styles.dotVerified} />
          <Text style={styles.badgeTextVerified}>Verified</Text>
        </View>
      );
    }
    if (status === 'pending') {
      return (
        <View style={styles.badgePending}>
          <View style={styles.dotPending} />
          <Text style={styles.badgeTextPending}>Pending</Text>
        </View>
      );
    }
    return (
      <View style={styles.badgeRejected}>
        <View style={styles.dotRejected} />
        <Text style={styles.badgeTextRejected}>Rejected</Text>
      </View>
    );
  };

  const renderItem = ({ item }) => {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={() =>
          navigation.navigate('ProviderVerification', {
            providerId: item.id,
          })
        }
        style={({ pressed }) => [styles.providerCard, pressed && styles.cardPressed]}
      >
        {renderProviderIcon(item.icon)}

        <View style={styles.providerInfo}>
          <Text style={styles.businessName} numberOfLines={1}>
            {item.businessName}
          </Text>
          <Text style={styles.categoryName} numberOfLines={1}>
            {item.category}
          </Text>
          {renderStatusBadge(item.status)}
        </View>

        <Ionicons name="chevron-forward" size={18} color="#A0AEC0" />
      </Pressable>
    );
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
        <Text style={styles.headerTitle}>Service Providers</Text>
        <View style={styles.headerRightSpacer} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={19} color={colors.textSecondary} />
          <TextInput
            accessibilityLabel="Search Service providers"
            placeholder="Search Service providers"
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 ? (
            <Pressable onPress={() => setSearchQuery('')} hitSlop={6}>
              <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
            </Pressable>
          ) : (
            <Ionicons name="options-outline" size={19} color={colors.textSecondary} />
          )}
        </View>
      </View>

      {/* Filter Chips */}
      <View style={styles.chipsSection}>
        {/* Chip 1: All Providers */}
        <Pressable
          accessibilityRole="button"
          onPress={() => setStatusFilter('all')}
          style={[
            styles.chip,
            statusFilter === 'all' ? styles.chipActive : styles.chipInactive,
          ]}
        >
          <Text
            style={[
              styles.chipText,
              statusFilter === 'all' && styles.chipTextActive,
            ]}
          >
            Providers
          </Text>
        </Pressable>

        {/* Chip 2: Verified */}
        <Pressable
          accessibilityRole="button"
          onPress={() => setStatusFilter('verified')}
          style={[
            styles.chip,
            statusFilter === 'verified' ? styles.chipActive : styles.chipInactive,
          ]}
        >
          <View
            style={[
              styles.filterDot,
              { backgroundColor: statusFilter === 'verified' ? '#86EFAC' : colors.success },
            ]}
          />
          <Text
            style={[
              styles.chipText,
              statusFilter === 'verified' && styles.chipTextActive,
            ]}
          >
            Verified
          </Text>
        </Pressable>

        {/* Chip 3: Pending */}
        <Pressable
          accessibilityRole="button"
          onPress={() => setStatusFilter('pending')}
          style={[
            styles.chip,
            statusFilter === 'pending' ? styles.chipActive : styles.chipInactive,
          ]}
        >
          <View
            style={[
              styles.filterDot,
              { backgroundColor: statusFilter === 'pending' ? '#FCD34D' : colors.warning },
            ]}
          />
          <Text
            style={[
              styles.chipText,
              statusFilter === 'pending' && styles.chipTextActive,
            ]}
          >
            Pending
          </Text>
        </Pressable>
      </View>

      {/* Provider List */}
      <FlatList
        data={filteredProviders}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={48} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>No service providers found</Text>
            <Text style={styles.emptySubtitle}>
              Try adjusting your search terms or filter selection.
            </Text>
          </View>
        }
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
  searchSection: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  searchBar: {
    minHeight: 46,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#D5DEE7',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    ...shadows.subtle,
  },
  searchInput: {
    flex: 1,
    fontSize: fontSizes.sm,
    color: colors.text,
    paddingVertical: spacing.xs,
  },
  chipsSection: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
    gap: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    borderRadius: radius.pill,
  },
  chipActive: {
    backgroundColor: colors.primary,
  },
  chipInactive: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: '#CED8E2',
    ...shadows.subtle,
  },
  chipText: {
    fontSize: fontSizes.xs,
    fontWeight: '600',
    color: colors.text,
  },
  chipTextActive: {
    color: colors.white,
  },
  filterDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxxl,
    gap: spacing.md,
  },
  providerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  cardPressed: {
    backgroundColor: '#F9FAFB',
  },
  providerLogoBox: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  providerInfo: {
    flex: 1,
    gap: 3,
  },
  businessName: {
    fontSize: fontSizes.sm,
    fontWeight: '700',
    color: colors.text,
  },
  categoryName: {
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  badgeVerified: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: colors.successSoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  dotVerified: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
  },
  badgeTextVerified: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.success,
  },
  badgePending: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: colors.warningSoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  dotPending: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.warning,
  },
  badgeTextPending: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.warning,
  },
  badgeRejected: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: colors.dangerSoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  dotRejected: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.danger,
  },
  badgeTextRejected: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.danger,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    fontSize: fontSizes.md,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
