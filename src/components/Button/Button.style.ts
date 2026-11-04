import { StyleSheet } from 'react-native';
import { colors, spacing } from '../../theme/theme';

export const styles = StyleSheet.create({
  btn: {
    minHeight: 48,
    borderRadius: 10,
    paddingHorizontal: spacing.m,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: colors.accent,
  },
  secondary: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  danger: {
    backgroundColor: colors.danger,
  },
  disabled: {
    opacity: 0.45,
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  labelSecondary: {
    color: colors.text,
  },
});
