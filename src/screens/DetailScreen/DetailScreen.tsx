import React from 'react';
import { View } from 'react-native';
import { Button } from '../../components/Button/Button';
import { ListItem } from '../../components/ListItem/ListItem';
import { Screen } from '../../components/Screen/Screen';
import { AppText } from '../../components/Text/Text';
import { styles } from './DetailScreen.style';

type Props = {
  onBack?: () => void;
};

export function DetailScreen({ onBack }: Props) {
  return (
    <Screen>
      <AppText variant="title">Подробнее</AppText>
      <AppText variant="muted">
        Только карточка — без отмены подписки.
      </AppText>
      <ListItem title="Мерчант" subtitle="сумма · период · последняя дата" />
      <View style={styles.actions}>
        <Button label="Назад" variant="secondary" onPress={onBack ?? (() => {})} />
      </View>
    </Screen>
  );
}
