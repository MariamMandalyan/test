import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { styles } from './ListItem.style';

type Props = {
  title: string;
  subtitle?: string;
  onPress?: () => void;
};

export function ListItem({ title, subtitle, onPress }: Props) {
  const content = (
    <>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </>
  );

  if (onPress) {
    return (
      <Pressable accessibilityRole="button" onPress={onPress} style={styles.root}>
        {content}
      </Pressable>
    );
  }

  return <View style={styles.root}>{content}</View>;
}
