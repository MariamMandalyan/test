import { StyleSheet } from 'react-native';
import { colors, spacing } from '../../theme/theme';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    flexGrow: 1,
    padding: spacing.m,
    gap: spacing.m,
  },
});
