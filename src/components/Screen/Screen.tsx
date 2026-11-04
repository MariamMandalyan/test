import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './Screen.style';

type Props = {
  children: React.ReactNode;
  scroll?: boolean;
};

export function Screen({ children, scroll = true }: Props) {
  if (!scroll) {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.content}>{children}</View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.content}>{children}</ScrollView>
    </SafeAreaView>
  );
}
