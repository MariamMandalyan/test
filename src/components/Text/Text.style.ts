import { StyleSheet } from 'react-native';
import { colors, typography } from '../../theme/theme';

export const styles = StyleSheet.create({
  title: {
    fontSize: typography.title,
    fontWeight: '700',
    color: colors.text,
  },
  body: {
    fontSize: typography.body,
    color: colors.text,
    lineHeight: 24,
  },
  muted: {
    fontSize: typography.caption,
    color: colors.muted,
    lineHeight: 20,
  },
});
