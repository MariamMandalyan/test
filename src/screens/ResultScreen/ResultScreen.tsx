import React from 'react';
import { Text, View } from 'react-native';
import { Banner } from '../../components/Banner/Banner';
import { Button } from '../../components/Button/Button';
import { Screen } from '../../components/Screen/Screen';
import { AppText } from '../../components/Text/Text';
import { formatAmountAud } from '../../services/fileValidation';
import useResultScreen from './ResultScreen-hook';
import { styles } from './ResultScreen.style';

export function ResultScreen() {
  const {
    items,
    totalLabel,
    deleting,
    handleOpenDetail,
    handleDelete,
    handleBack,
  } = useResultScreen();

  return (
    <Screen>
      <AppText variant="title">Готово</AppText>
      <AppText variant="muted">
        Данные из ответа mock, не из парсинга файла на клиенте.
      </AppText>
      <Banner tone="ok">{totalLabel}</Banner>
      <View style={styles.list}>
        {items.map(item => (
          <View key={item.id} style={styles.row}>
            <Text style={styles.merchant}>{item.merchant}</Text>
            <Text style={styles.meta}>
              {formatAmountAud(item.amountMinor)} · {item.cadence} ·{' '}
              {item.lastSeen}
            </Text>
            <Button
              label="Подробнее"
              onPress={() => handleOpenDetail(item)}
              disabled={deleting}
            />
          </View>
        ))}
      </View>
      <View style={styles.actions}>
        <Button
          label={deleting ? 'Удаление…' : 'Удалить импорт'}
          variant="danger"
          onPress={handleDelete}
          disabled={deleting}
        />
        <Button
          label="Назад"
          variant="secondary"
          onPress={handleBack}
          disabled={deleting}
        />
      </View>
    </Screen>
  );
}
