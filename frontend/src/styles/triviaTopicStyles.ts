import { StyleSheet } from 'react-native';
import { theme } from '../theme';

export const triviaTopicStyles = StyleSheet.create({
  favToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  favToggleHint: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.textMuted,
  },
  favFilterChip: {
    width: 48,
    minWidth: 48,
    borderRadius: theme.radius.md,
    borderWidth: 2,
    borderColor: theme.colors.surfaceLight,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
  },
  favFilterChipSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
  },
  favCountBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  favCountText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.text,
  },
  topicRowSelected: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
  },
  topicSearchInput: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.sm,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.surfaceLight,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
  },
  topicListEmpty: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    textAlign: 'center',
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
  },
  topicFavButton: {
    padding: theme.spacing.sm,
    marginLeft: theme.spacing.xs,
  },
});