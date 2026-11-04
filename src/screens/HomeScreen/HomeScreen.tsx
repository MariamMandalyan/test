import React from 'react';
import { View } from 'react-native';
import { Banner } from '../../components/Banner/Banner';
import { Button } from '../../components/Button/Button';
import { Screen } from '../../components/Screen/Screen';
import { AppText } from '../../components/Text/Text';
import useHomeScreen from './HomeScreen-hook';
import { styles } from './HomeScreen.style';

export function HomeScreen() {
  const { picking, handlePickFile, handleOpenDiagnostics } = useHomeScreen();

  return (
    <Screen>
      <AppText variant="title">Импорт выписки</AppText>
      <AppText variant="muted">
        Выберите синтетический PDF или CSV. Проверка размера и содержимого — до
        отправки на сервер.
      </AppText>
      <Banner tone="info">Пусто — файл ещё не выбран.</Banner>
      <View style={styles.actions}>
        <Button
          label={picking ? 'Открытие…' : 'Выбрать файл'}
          onPress={handlePickFile}
          disabled={picking}
        />
        <Button
          label="Диагностика"
          variant="secondary"
          onPress={handleOpenDiagnostics}
        />
      </View>
    </Screen>
  );
}
