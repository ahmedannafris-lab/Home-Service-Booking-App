import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fontSizes, radius, shadows, spacing } from '../theme';

export function ConfirmModal({
  visible = false,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'danger',
  onConfirm,
  onCancel,
}) {
  if (!visible) return null;

  const isDanger = confirmVariant === 'danger';

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onCancel} />
        <View style={styles.dialog}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              onPress={onCancel}
              style={({ pressed }) => [
                styles.button,
                styles.cancelButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.cancelButtonText}>{cancelText}</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={onConfirm}
              style={({ pressed }) => [
                styles.button,
                isDanger ? styles.dangerButton : styles.primaryButton,
                pressed && styles.pressed,
              ]}
            >
              <Text
                style={[
                  styles.buttonText,
                  isDanger ? styles.dangerButtonText : styles.primaryButtonText,
                ]}
              >
                {confirmText}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  dialog: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    ...shadows.raised,
  },
  title: {
    fontSize: fontSizes.lg,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  message: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.md,
  },
  button: {
    minHeight: 42,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: colors.muted,
  },
  cancelButtonText: {
    color: colors.text,
    fontWeight: '600',
    fontSize: fontSizes.md,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  primaryButtonText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: fontSizes.md,
  },
  dangerButton: {
    backgroundColor: colors.danger,
  },
  dangerButtonText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: fontSizes.md,
  },
  buttonText: {
    fontSize: fontSizes.md,
  },
  pressed: {
    opacity: 0.82,
  },
});
