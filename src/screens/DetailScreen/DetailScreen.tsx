import React from 'react';
import { View } from 'react-native';
import { Banner } from '../../components/Banner/Banner';
import { Button } from '../../components/Button/Button';
import { Screen } from '../../components/Screen/Screen';
import { AppText } from '../../components/Text/Text';
import { formatAmountAud } from '../../services/fileValidation';
import useDetailScreen from './DetailScreen-hook';
import { styles } from './DetailScreen.style';

export function DetailScreen() {
  const { item, handleBack } = useDetailScreen();

  return (
    <Screen>
      <AppText variant="title">{item.merchant}</AppText>
      <AppText variant="muted">
        Только карточка — без отмены подписки.
      </AppText>
      <Banner tone="info">
        {`Id: ${item.id}\nСумма: ${formatAmountAud(item.amountMinor)}\nПериод: ${item.cadence}\nПоследняя дата: ${item.lastSeen}`}
      </Banner>
      <AppText variant="body">
        На этом экране намеренно нет действия «отменить подписку».
      </AppText>
      <View style={styles.actions}>
        <Button
          label="Назад к списку"
          variant="secondary"
          onPress={handleBack}
        />
      </View>
    </Screen>
  );
}
