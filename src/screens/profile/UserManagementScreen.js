import React, { useState, useMemo } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAdmin } from '../../context/AdminContext';
import { colors, fontSizes, radius, shadows, spacing } from '../../theme';

export function UserManagementScreen({ navigation }) {
  const { users } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'active' | 'inactive'

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesStatus =
        statusFilter === 'all' || u.status === statusFilter;

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        (u.name && u.name.toLowerCase().includes(q)) ||
        (u.code && u.code.toLowerCase().includes(q)) ||
        (u.email && u.email.toLowerCase().includes(q)) ||
        (u.city && u.city.toLowerCase().includes(q));

      return matchesStatus && matchesSearch;
    });
  }, [users, statusFilter, searchQuery]);

  const renderStatusPill = (status) => {
    const isActive = status === 'active';
    return (
      <View style={isActive ? styles.pillActive : styles.pillInactive}>
        <View
          style={[
            styles.statusDot,
            { backgroundColor: isActive ? colors.success : colors.textSecondary },
          ]}
        />
        <Text style={isActive ? styles.pillTextActive : styles.pillTextInactive}>
          {isActive ? 'Active' : 'Inactive'}
        </Text>
      </View>
    );
  };

  const renderItem = ({ item }) => {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={() =>
          navigation.navigate('ManageUser', {
            userId: item.id,
          })
        }
        style={({ pressed }) => [styles.userCard, pressed && styles.cardPressed]}
      >
        <Image
          source={{
            uri:
              item.avatar ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          }}
          style={styles.avatar}
        />

        <View style={styles.userInfo}>
          <Text style={styles.userName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.userCode}>{item.code || 'USR 1024'}</Text>
          {renderStatusPill(item.status)}
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
        <Text style={styles.headerTitle}>User Management</Text>
        <View style={styles.headerRightSpacer} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={19} color={colors.textSecondary} />
          <TextInput
            accessibilityLabel="Search user"
            placeholder="Search user"
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
        {/* All Users */}
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
            All Users
          </Text>
        </Pressable>

        {/* Active */}
        <Pressable
          accessibilityRole="button"
          onPress={() => setStatusFilter('active')}
          style={[
            styles.chip,
            statusFilter === 'active' ? styles.chipActive : styles.chipInactive,
          ]}
        >
          <View
            style={[
              styles.filterDot,
              { backgroundColor: statusFilter === 'active' ? '#86EFAC' : colors.success },
            ]}
          />
          <Text
            style={[
              styles.chipText,
              statusFilter === 'active' && styles.chipTextActive,
            ]}
          >
            Active
          </Text>
        </Pressable>

        {/* Inactive */}
        <Pressable
          accessibilityRole="button"
          onPress={() => setStatusFilter('inactive')}
          style={[
            styles.chip,
            statusFilter === 'inactive' ? styles.chipActive : styles.chipInactive,
          ]}
        >
          <View
            style={[
              styles.filterDot,
              { backgroundColor: statusFilter === 'inactive' ? '#CBD5E1' : colors.textSecondary },
            ]}
          />
          <Text
            style={[
              styles.chipText,
              statusFilter === 'inactive' && styles.chipTextActive,
            ]}
          >
            Inactive
          </Text>
        </Pressable>
      </View>

      {/* Registered Users Count */}
      <View style={styles.counterRow}>
        <Text style={styles.counterText}>
          {filteredUsers.length} registered users
        </Text>
      </View>

      {/* User List */}
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={48} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>No users found</Text>
            <Text style={styles.emptySubtitle}>
              Try adjusting your search query or status filter.
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
  counterRow: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  counterText: {
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xxxl,
    gap: spacing.md,
  },
  userCard: {
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
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primarySoft,
    marginRight: spacing.md,
  },
  userInfo: {
    flex: 1,
    gap: 2,
  },
  userName: {
    fontSize: fontSizes.sm,
    fontWeight: '700',
    color: colors.text,
  },
  userCode: {
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
  },
  pillActive: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: colors.successSoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
    marginTop: 2,
  },
  pillInactive: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: colors.muted,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
    marginTop: 2,
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  pillTextActive: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.success,
  },
  pillTextInactive: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary,
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
