import { StyleSheet } from 'react-native';
import { theme } from '../theme';

export const globalStyles = StyleSheet.create({
  // Buttons
  primaryButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: theme.fontSize.md,
    fontWeight: '700',
    color: theme.colors.text,
  },
  secondaryButton: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.surfaceLight,
  },
  secondaryButtonText: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.text,
  },
  cancelButton: {
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  cancelButtonText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textMuted,
    fontWeight: '600',
  },
  linkButton: {
    alignItems: 'center',
  },
  linkText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.primary,
    fontWeight: '600',
  },

  // Form
  input: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.surfaceLight,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
  },
  errorText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.accent,
    marginBottom: theme.spacing.md,
  },
  successText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
  },

  // Small action buttons (e.g. Auto select, Auto pick)
  smallButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    alignItems: 'center',
  },
  smallButtonText: {
    fontSize: theme.fontSize.sm,
    fontWeight: '700',
    color: theme.colors.text,
  },

  // Screen Layout
  screenContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  screenContainerPadding: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 0,
  },
  screenContainerPaddingMd: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: 0,
  },
  screenTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: '800',
    color: theme.colors.text,
    marginBottom: 2,
  },
  screenTitleLarge: {
    fontSize: theme.fontSize.title,
    fontWeight: '800',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  screenSubtitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.sm,
  },
  screenSubtitleLg: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.lg,
  },

  // Search / text input (compact)
  searchInput: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.sm,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.surfaceLight,
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
  },

  // Empty / status text
  emptyState: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginTop: theme.spacing.lg,
  },
  mutedText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },

  // Disabled state (overlay on controls)
  controlDisabled: {
    opacity: 0.5,
  },
  controlDisabledText: {
    color: theme.colors.textMuted,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.xl,
    width: '100%',
    maxWidth: 320,
    borderWidth: 2,
    borderColor: theme.colors.surfaceLight,
  },
  modalTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
});