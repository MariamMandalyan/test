import React from 'react';
import { View } from 'react-native';
import { Banner } from '../../components/Banner/Banner';
import { Button } from '../../components/Button/Button';
import { Screen } from '../../components/Screen/Screen';
import { AppText } from '../../components/Text/Text';
import { styles } from './HomeScreen.style';

type Props = {
  onOpenDiagnostics?: () => void;
};

export function HomeScreen({ onOpenDiagnostics }: Props) {
  return (
    <Screen>
      <AppText variant="title">Импорт выписки</AppText>
      <AppText variant="muted">
        Выберите синтетический PDF или CSV. Загрузка будет на следующих этапах.
      </AppText>
      <Banner tone="info">Пусто — файл ещё не выбран.</Banner>
      <View style={styles.actions}>
        <Button label="Выбрать файл" onPress={() => {}} disabled />
        <Button
          label="Диагностика"
          variant="secondary"
          onPress={onOpenDiagnostics ?? (() => {})}
        />
      </View>
    </Screen>
  );
}
