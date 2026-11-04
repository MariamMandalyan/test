import React from 'react';
import { View } from 'react-native';
import { Banner } from '../../components/Banner/Banner';
import { Button } from '../../components/Button/Button';
import { Screen } from '../../components/Screen/Screen';
import { AppText } from '../../components/Text/Text';
import useDiagnosticsScreen, {
  SCENARIO_MODES,
} from './DiagnosticsScreen-hook';
import { styles } from './DiagnosticsScreen.style';

export function DiagnosticsScreen() {
  const {
    busy,
    message,
    stateText,
    activeMode,
    handleSetScenario,
    handleRefreshState,
    handleReset,
    handleBack,
  } = useDiagnosticsScreen();

  return (
    <Screen>
      <AppText variant="title">Диагностика</AppText>
      <AppText variant="muted">
        Переключение сценариев mock через /__test/scenario. Исходники kit между
        прогонами не меняем.
      </AppText>
      {message ? <Banner tone="info">{message}</Banner> : null}
      {stateText ? <Banner tone="ok">{stateText}</Banner> : null}
      {activeMode ? (
        <Banner tone="info">{`Активный сценарий: ${activeMode}`}</Banner>
      ) : null}
      <AppText variant="muted">
        lost_ack — первый POST без ответа; stale_status — устаревшая revision
        после ready; delete_failure — DELETE 503 без удаления.
      </AppText>
      <View style={styles.actions}>
        {SCENARIO_MODES.map(mode => (
          <Button
            key={mode}
            label={mode === activeMode ? `✓ ${mode}` : mode}
            variant={mode === activeMode ? 'primary' : 'secondary'}
            onPress={() => handleSetScenario(mode)}
            disabled={busy}
          />
        ))}
        <Button
          label="Обновить /__test/state"
          variant="secondary"
          onPress={handleRefreshState}
          disabled={busy}
        />
        <Button
          label="Сбросить mock"
          variant="danger"
          onPress={handleReset}
          disabled={busy}
        />
        <Button
          label="Назад"
          variant="secondary"
          onPress={handleBack}
          disabled={busy}
        />
      </View>
    </Screen>
  );
}
