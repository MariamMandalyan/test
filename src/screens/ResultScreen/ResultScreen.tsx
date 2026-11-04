import React from 'react';
import { View } from 'react-native';
import { Button } from '../../components/Button/Button';
import { ListItem } from '../../components/ListItem/ListItem';
import { Screen } from '../../components/Screen/Screen';
import { AppText } from '../../components/Text/Text';
import { styles } from './ResultScreen.style';

type Props = {
  onOpenDetails?: () => void;
  onDelete?: () => void;
  onBack?: () => void;
};

export function ResultScreen({ onOpenDetails, onDelete, onBack }: Props) {
  return (
    <Screen>
      <AppText variant="title">Готово</AppText>
      <AppText variant="muted">
        Два регулярных списания из mock · сумму посчитаем позже.
      </AppText>
      <View style={styles.list}>
        <ListItem
          title="StreamBeam"
          subtitle="заглушка"
          onPress={onOpenDetails}
        />
        <ListItem
          title="BrightGrid"
          subtitle="заглушка"
          onPress={onOpenDetails}
        />
      </View>
      <View style={styles.actions}>
        <Button
          label="Удалить импорт"
          variant="danger"
          onPress={onDelete ?? (() => {})}
          disabled
        />
        <Button label="Назад" variant="secondary" onPress={onBack ?? (() => {})} />
      </View>
    </Screen>
  );
}
