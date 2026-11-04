import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootStackParamList } from '../../navigation/types';
import { selectedFileSelector } from '../../redux/selectors/administrativeSelector';
import {
  importJobSelector,
  importPhaseSelector,
  importResumeAvailableSelector,
} from '../../redux/selectors/importSelector';
import {
  setSelectedFile,
  showWarningModal,
} from '../../redux/slices/administrativeSlice';
import {
  clearResumeAvailable,
  resetImport,
} from '../../redux/slices/importSlice';
import type { AppDispatch } from '../../redux/store';
import { pickStatementFile } from '../../utils/pickFile';

const useHomeScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [picking, setPicking] = useState(false);
  const resumeAvailable = useSelector(importResumeAvailableSelector);
  const phase = useSelector(importPhaseSelector);
  const job = useSelector(importJobSelector);
  const selectedFile = useSelector(selectedFileSelector);

  const handlePickFile = useCallback(async () => {
    if (picking) {
      return;
    }
    setPicking(true);
    try {
      const result = await pickStatementFile();
      if (result.ok) {
        dispatch(resetImport());
        dispatch(setSelectedFile(result.file));
        navigation.navigate('Confirm');
        return;
      }
      if (result.cancelled) {
        return;
      }
      dispatch(
        showWarningModal({
          title: 'Файл отклонён',
          description: result.message,
          actionButtons: [{ label: 'OK' }],
        }),
      );
    } finally {
      setPicking(false);
    }
  }, [dispatch, navigation, picking]);

  const handleContinueResume = useCallback(() => {
    dispatch(clearResumeAvailable());
    if (phase === 'ready' && job?.status === 'ready') {
      navigation.navigate('Result');
      return;
    }
    if (
      phase === 'polling' ||
      phase === 'recovering' ||
      phase === 'uploading' ||
      phase === 'deleting' ||
      phase === 'error'
    ) {
      navigation.navigate('Status');
      return;
    }
    if (phase === 'confirming' && selectedFile) {
      navigation.navigate('Confirm');
    }
  }, [dispatch, job?.status, navigation, phase, selectedFile]);

  const handleOpenDiagnostics = useCallback(() => {
    navigation.navigate('Diagnostics');
  }, [navigation]);

  return {
    picking,
    resumeAvailable,
    handlePickFile,
    handleContinueResume,
    handleOpenDiagnostics,
  };
};

export default useHomeScreen;
