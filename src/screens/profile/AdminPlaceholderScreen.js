import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSizes, radius, shadows, spacing } from '../../theme';

export function AdminPlaceholderScreen({ navigation, route }) {
  const title = route?.params?.title || 'Feature';
  const description =
    route?.params?.description ||
    'This management feature is configured as a placeholder module in the current milestone.';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Go back"
          accessibilityRole="button"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={styles.headerRightPlaceholder} />
      </View>

      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Ionicons name="construct-outline" size={32} color={colors.primary} />
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>

        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
        >
          <Ionicons name="arrow-back" size={18} color={colors.white} />
          <Text style={styles.backBtnText}>Return to Admin Portal</Text>
        </Pressable>
      </View>
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: fontSizes.lg,
    fontWeight: '700',
    color: colors.text,
  },
  headerRightPlaceholder: {
    width: 40,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.xxxl,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fontSizes.xl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  description: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xxl,
    maxWidth: 320,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    ...shadows.card,
  },
  backBtnText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: fontSizes.md,
  },
  pressed: {
    opacity: 0.85,
  },
});
