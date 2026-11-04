import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useEffect, useState } from 'react';
import type { RootStackParamList } from '../../navigation/types';
import {
  getMockState,
  resetMock,
  setScenario,
  type MockState,
} from '../../services/api';
import type { ScenarioMode } from '../../types/import';

export const SCENARIO_MODES: ScenarioMode[] = [
  'happy',
  'lost_ack',
  'stale_status',
  'delete_failure',
];

const useDiagnosticsScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [mockState, setMockState] = useState<MockState | null>(null);

  const refreshState = useCallback(async () => {
    try {
      const state = await getMockState();
      setMockState(state);
    } catch (error) {
      setMockState(null);
      setMessage(
        error instanceof Error
          ? error.message
          : 'Не удалось прочитать /__test/state',
      );
    }
  }, []);

  useEffect(() => {
    void refreshState();
  }, [refreshState]);

  const handleSetScenario = useCallback(
    async (mode: ScenarioMode) => {
      if (busy) {
        return;
      }
      setBusy(true);
      try {
        await setScenario(mode);
        setMessage(`Сценарий: ${mode}`);
        await refreshState();
      } catch (error) {
        setMessage(
          error instanceof Error
            ? error.message
            : 'Не удалось переключить сценарий',
        );
      } finally {
        setBusy(false);
      }
    },
    [busy, refreshState],
  );

  const handleRefreshState = useCallback(async () => {
    if (busy) {
      return;
    }
    setBusy(true);
    try {
      await refreshState();
      setMessage('Состояние mock обновлено');
    } finally {
      setBusy(false);
    }
  }, [busy, refreshState]);

  const handleReset = useCallback(async () => {
    if (busy) {
      return;
    }
    setBusy(true);
    try {
      await resetMock();
      setMessage('Mock сброшен');
      await refreshState();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Не удалось сбросить mock',
      );
    } finally {
      setBusy(false);
    }
  }, [busy, refreshState]);

  const handleBack = useCallback(() => {
    navigation.navigate('Home');
  }, [navigation]);

  const stateText = mockState
    ? `mode=${mockState.mode}\ncreateRequests=${mockState.stats.createRequests}\nnewJobs=${mockState.stats.newJobs}\nduplicateHits=${mockState.stats.duplicateHits}\nacceptedBytes=${mockState.stats.acceptedBytes}\ndeleteRequests=${mockState.stats.deleteRequests}`
    : null;

  return {
    busy,
    message,
    stateText,
    activeMode: mockState?.mode ?? null,
    handleSetScenario,
    handleRefreshState,
    handleReset,
    handleBack,
  };
};

export default useDiagnosticsScreen;
