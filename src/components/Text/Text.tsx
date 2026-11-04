import React from 'react';
import { Text as RNText, type TextProps, type TextStyle } from 'react-native';
import { styles } from './Text.style';

type Variant = 'title' | 'body' | 'muted';

type Props = TextProps & {
  variant?: Variant;
  children: React.ReactNode;
  style?: TextStyle | TextStyle[];
};

export function AppText({ variant = 'body', children, style, ...rest }: Props) {
  const variantStyle =
    variant === 'title'
      ? styles.title
      : variant === 'muted'
        ? styles.muted
        : styles.body;

  return (
    <RNText style={[variantStyle, style]} {...rest}>
      {children}
    </RNText>
  );
}
