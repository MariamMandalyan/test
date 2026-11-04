import React from 'react';
import { View } from 'react-native';
import { Banner } from '../../components/Banner/Banner';
import { Button } from '../../components/Button/Button';
import { Screen } from '../../components/Screen/Screen';
import { AppText } from '../../components/Text/Text';
import { styles } from './StatusScreen.style';

type Props = {
  onBack?: () => void;
};

export function StatusScreen({ onBack }: Props) {
  return (
    <Screen>
      <AppText variant="title">Статус импорта</AppText>
      <AppText variant="muted">
        В очереди / обработка / восстановление / удаление — ответ 202 ещё не
        готовый отчёт.
      </AppText>
      <Banner tone="info">Ожидание обновлений job…</Banner>
      <View style={styles.actions}>
        <Button label="Назад" variant="secondary" onPress={onBack ?? (() => {})} />
      </View>
    </Screen>
  );
}
