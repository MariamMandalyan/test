import React from 'react';
import { View } from 'react-native';
import { Banner } from '../../components/Banner/Banner';
import { Button } from '../../components/Button/Button';
import { ListItem } from '../../components/ListItem/ListItem';
import { Screen } from '../../components/Screen/Screen';
import { AppText } from '../../components/Text/Text';
import { formatFileSize } from '../../services/fileValidation';
import useConfirmScreen from './ConfirmScreen-hook';
import { styles } from './ConfirmScreen.style';

export function ConfirmScreen() {
  const { file, handleBack, handleConfirm } = useConfirmScreen();

  if (!file) {
    return null;
  }

  return (
    <Screen>
      <AppText variant="title">Подтверждение файла</AppText>
      <AppText variant="muted">
        Имя, размер и формат — до отправки на сервер.
      </AppText>
      <Banner tone="ok">Файл прошёл локальную проверку. POST ещё не начат.</Banner>
      <ListItem
        title={file.name}
        subtitle={`${file.format.toUpperCase()} · ${formatFileSize(file.size)} (${file.size} байт)`}
      />
      <View style={styles.actions}>
        <Button label="Отправить" onPress={handleConfirm} disabled />
        <Button label="Назад" variant="secondary" onPress={handleBack} />
      </View>
    </Screen>
  );
}
