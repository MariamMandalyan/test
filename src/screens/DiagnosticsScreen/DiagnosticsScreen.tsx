import React from 'react';
import { View } from 'react-native';
import { Banner } from '../../components/Banner/Banner';
import { Button } from '../../components/Button/Button';
import { Screen } from '../../components/Screen/Screen';
import { AppText } from '../../components/Text/Text';
import { styles } from './DiagnosticsScreen.style';

type Props = {
  onBack?: () => void;
};

export function DiagnosticsScreen({ onBack }: Props) {
  return (
    <Screen>
      <AppText variant="title">Диагностика</AppText>
      <AppText variant="muted">
        Переключение сценария mock через /__test/scenario и просмотр
        /__test/state.
      </AppText>
      <Banner tone="warn">Подключение API — на следующем этапе.</Banner>
      <View style={styles.actions}>
        <Button label="happy" onPress={() => {}} disabled />
        <Button label="lost_ack" variant="secondary" onPress={() => {}} disabled />
        <Button label="stale_status" variant="secondary" onPress={() => {}} disabled />
        <Button label="delete_failure" variant="secondary" onPress={() => {}} disabled />
        <Button label="Назад" variant="secondary" onPress={onBack ?? (() => {})} />
      </View>
    </Screen>
  );
}
