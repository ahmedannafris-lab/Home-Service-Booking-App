import { Ionicons } from '@expo/vector-icons';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { colors, fontSizes, radius, shadows, spacing } from '../theme';
export { ConfirmModal } from './ConfirmModal';

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  disabled = false,
  style,
}) {
  const isPrimary = variant === 'primary';
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        size === 'sm' && styles.buttonSmall,
        isPrimary ? styles.buttonPrimary : styles.buttonSecondary,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      {icon ? <Ionicons name={icon} size={18} color={isPrimary ? colors.white : colors.primary} /> : null}
      <Text style={[styles.buttonText, !isPrimary && styles.buttonSecondaryText]}>{title}</Text>
    </Pressable>
  );
}

export function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Badge({ label, tone = 'neutral', style }) {
  const toneStyle = {
    neutral: [styles.badgeNeutral, styles.badgeNeutralText],
    success: [styles.badgeSuccess, styles.badgeSuccessText],
    warning: [styles.badgeWarning, styles.badgeWarningText],
    danger: [styles.badgeDanger, styles.badgeDangerText],
  }[tone] || [styles.badgeNeutral, styles.badgeNeutralText];
  return (
    <View style={[styles.badge, toneStyle[0], style]}>
      <Text style={[styles.badgeText, toneStyle[1]]}>{label}</Text>
    </View>
  );
}

export function Chip({ label, selected = false, onPress, style }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected, style]}
    >
      <Text style={[styles.chipText, selected && styles.chipSelectedText]}>{label}</Text>
    </Pressable>
  );
}

export function SearchBar({ value, onChangeText, placeholder = 'Search services', style }) {
  return (
    <View style={[styles.search, style]}>
      <Ionicons name="search-outline" size={19} color={colors.textSecondary} />
      <TextInput
        accessibilityLabel={placeholder}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        returnKeyType="search"
        style={styles.searchInput}
        value={value}
      />
      <Ionicons name="options-outline" size={19} color={colors.textSecondary} />
    </View>
  );
}

export function Avatar({ name = '', imageUrl, size = 44, style }) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }, style]}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={{ width: size, height: size, borderRadius: size / 2 }} />
      ) : (
        <Text style={[styles.avatarText, { fontSize: Math.max(12, size * 0.34) }]}>{initials || '?'}</Text>
      )}
    </View>
  );
}

export function Header({ title, subtitle, onBack, rightAction }) {
  return (
    <View style={styles.header}>
      {onBack ? (
        <Pressable accessibilityLabel="Go back" accessibilityRole="button" onPress={onBack} style={styles.headerBack}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </Pressable>
      ) : null}
      <View style={styles.headerCopy}>
        <Text style={styles.headerTitle}>{title}</Text>
        {subtitle ? <Text style={styles.headerSubtitle}>{subtitle}</Text> : null}
      </View>
      {rightAction || null}
    </View>
  );
}

export function ListItem({ title, subtitle, avatar, icon, trailing, onPress, style }) {
  const content = (
    <>
      {avatar ? <Avatar name={avatar.name} imageUrl={avatar.imageUrl} size={42} /> : null}
      {icon ? <View style={styles.listIcon}><Ionicons name={icon} size={20} color={colors.primary} /></View> : null}
      <View style={styles.listCopy}>
        <Text numberOfLines={1} style={styles.listTitle}>{title}</Text>
        {subtitle ? <Text numberOfLines={1} style={styles.listSubtitle}>{subtitle}</Text> : null}
      </View>
      {trailing || <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />}
    </>
  );
  const containerStyle = [styles.listItem, style];
  return onPress ? (
    <Pressable accessibilityRole="button" onPress={onPress} style={containerStyle}>{content}</Pressable>
  ) : (
    <View style={containerStyle}>{content}</View>
  );
}

const styles = StyleSheet.create({
  button: { minHeight: 48, paddingHorizontal: spacing.lg, borderRadius: radius.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  buttonSmall: { minHeight: 38, paddingHorizontal: spacing.md },
  buttonPrimary: { backgroundColor: colors.primary },
  buttonSecondary: { backgroundColor: colors.primarySoft },
  buttonText: { color: colors.white, fontWeight: '700', fontSize: fontSizes.md },
  buttonSecondaryText: { color: colors.primary },
  disabled: { opacity: 0.48 },
  pressed: { opacity: 0.84 },
  card: { padding: spacing.lg, backgroundColor: colors.surface, borderRadius: radius.md, ...shadows.card },
  badge: { alignSelf: 'flex-start', paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: radius.pill },
  badgeText: { fontSize: fontSizes.xs, fontWeight: '700' },
  badgeNeutral: { backgroundColor: colors.muted },
  badgeNeutralText: { color: colors.textSecondary },
  badgeSuccess: { backgroundColor: colors.successSoft },
  badgeSuccessText: { color: colors.success },
  badgeWarning: { backgroundColor: colors.warningSoft },
  badgeWarningText: { color: colors.warning },
  badgeDanger: { backgroundColor: colors.dangerSoft },
  badgeDangerText: { color: colors.danger },
  chip: { minHeight: 34, paddingHorizontal: spacing.md, justifyContent: 'center', borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  chipSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.textSecondary, fontSize: fontSizes.sm, fontWeight: '600' },
  chipSelectedText: { color: colors.white },
  search: { minHeight: 48, paddingHorizontal: spacing.md, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md },
  searchInput: { flex: 1, color: colors.text, fontSize: fontSizes.md, paddingVertical: spacing.sm },
  avatar: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden', backgroundColor: colors.primarySoft },
  avatarText: { color: colors.primary, fontWeight: '700' },
  header: { minHeight: 58, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  headerBack: { width: 36, height: 42, justifyContent: 'center' },
  headerCopy: { flex: 1 },
  headerTitle: { color: colors.text, fontSize: fontSizes.xl, fontWeight: '700' },
  headerSubtitle: { marginTop: 2, color: colors.textSecondary, fontSize: fontSizes.sm },
  listItem: { minHeight: 64, paddingVertical: spacing.sm, flexDirection: 'row', alignItems: 'center', gap: spacing.md, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  listIcon: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center', borderRadius: radius.md, backgroundColor: colors.primarySoft },
  listCopy: { flex: 1, gap: 3 },
  listTitle: { color: colors.text, fontSize: fontSizes.md, fontWeight: '600' },
  listSubtitle: { color: colors.textSecondary, fontSize: fontSizes.sm },
});