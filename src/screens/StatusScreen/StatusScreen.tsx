import React from 'react';
import { View } from 'react-native';
import { Banner } from '../../components/Banner/Banner';
import { Button } from '../../components/Button/Button';
import { ListItem } from '../../components/ListItem/ListItem';
import { Screen } from '../../components/Screen/Screen';
import { AppText } from '../../components/Text/Text';
import useStatusScreen from './StatusScreen-hook';
import { styles } from './StatusScreen.style';

export function StatusScreen() {
  const { job, phase, errorMessage, handleBack } = useStatusScreen();

  const bannerTone =
    phase === 'error' ? 'error' : job?.status === 'queued' ? 'info' : 'ok';

  const bannerText = errorMessage
    ? errorMessage
    : job
      ? `status=${job.status}, revision=${job.revision}. Ответ 202 — ещё не готовый отчёт.`
      : 'Ожидание обновлений job…';

  return (
    <Screen>
      <AppText variant="title">Статус импорта</AppText>
      <AppText variant="muted">
        В очереди / обработка / восстановление / удаление — ответ 202 ещё не
        готовый отчёт.
      </AppText>
      <Banner tone={bannerTone}>{bannerText}</Banner>
      {job ? (
        <ListItem
          title={job.jobId}
          subtitle={`phase=${phase} · ${job.status} · rev ${job.revision}`}
        />
      ) : null}
      <View style={styles.actions}>
        <Button label="Назад" variant="secondary" onPress={handleBack} />
      </View>
    </Screen>
  );
}
