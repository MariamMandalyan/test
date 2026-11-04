import React from 'react';
import { View } from 'react-native';
import { Button } from '../../components/Button/Button';
import { ListItem } from '../../components/ListItem/ListItem';
import { Screen } from '../../components/Screen/Screen';
import { AppText } from '../../components/Text/Text';
import { styles } from './ConfirmScreen.style';

type Props = {
  onBack?: () => void;
  onConfirm?: () => void;
};

export function ConfirmScreen({ onBack, onConfirm }: Props) {
  return (
    <Screen>
      <AppText variant="title">Подтверждение файла</AppText>
      <AppText variant="muted">
        Имя, размер и формат — до отправки на сервер.
      </AppText>
      <ListItem title="имя_файла.ext" subtitle="формат · размер" />
      <View style={styles.actions}>
        <Button label="Отправить" onPress={onConfirm ?? (() => {})} disabled />
        <Button label="Назад" variant="secondary" onPress={onBack ?? (() => {})} />
      </View>
    </Screen>
  );
}
