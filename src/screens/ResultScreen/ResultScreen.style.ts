import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../theme/theme';

export const styles = StyleSheet.create({
  list: {
    gap: spacing.m,
  },
  row: {
    backgroundColor: colors.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.m,
    gap: spacing.s,
  },
  merchant: {
    fontSize: typography.body + 3,
    fontWeight: '700',
    color: colors.text,
  },
  meta: {
    fontSize: typography.body,
    color: colors.muted,
  },
  actions: {
    gap: spacing.s,
  },
});
