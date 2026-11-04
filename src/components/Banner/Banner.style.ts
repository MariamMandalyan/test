import { StyleSheet } from 'react-native';
import { colors, spacing } from '../../theme/theme';

export const styles = StyleSheet.create({
  root: {
    borderRadius: 10,
    padding: spacing.m,
    borderWidth: 1,
  },
  info: {
    backgroundColor: '#ECFEFF',
    borderColor: '#A5F3FC',
  },
  error: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  ok: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  warn: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
  },
  text: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 22,
  },
});
