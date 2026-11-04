import React from 'react';
import { Text, View } from 'react-native';
import { styles } from './Banner.style';

type Tone = 'info' | 'error' | 'ok' | 'warn';

type Props = {
  tone?: Tone;
  children: React.ReactNode;
};

export function Banner({ tone = 'info', children }: Props) {
  const toneStyle =
    tone === 'error'
      ? styles.error
      : tone === 'ok'
        ? styles.ok
        : tone === 'warn'
          ? styles.warn
          : styles.info;

  return (
    <View style={[styles.root, toneStyle]}>
      <Text style={styles.text}>{children}</Text>
    </View>
  );
}
