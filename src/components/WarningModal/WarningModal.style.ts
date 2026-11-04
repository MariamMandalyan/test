import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../theme/theme';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.m,
  },
  container: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.l,
    gap: spacing.m,
  },
  title: {
    fontSize: typography.title - 6,
    fontWeight: '700',
    color: colors.text,
  },
  description: {
    fontSize: typography.body,
    lineHeight: 24,
    color: colors.muted,
  },
  actions: {
    gap: spacing.s,
    marginTop: spacing.s,
  },
});
