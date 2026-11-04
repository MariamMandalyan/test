import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { POLL_INTERVAL_MS } from '../../config';
import type { RootStackParamList } from '../../navigation/types';
import { selectedFileSelector } from '../../redux/selectors/administrativeSelector';
import {
  importCreateKeySelector,
  importDeleteKeySelector,
  importErrorSelector,
  importJobSelector,
  importMaxRevisionSelector,
  importPhaseSelector,
  importTombstoneSelector,
} from '../../redux/selectors/importSelector';
import { setSelectedFile } from '../../redux/slices/administrativeSlice';
import {
  resetImport,
  setImportError,
  setImportJob,
  setImportPhase,
} from '../../redux/slices/importSlice';
import type { AppDispatch } from '../../redux/store';
import {
  markDeletedComplete,
  pollOnce,
  type ResumedImport,
} from '../../services/importJob';
import { clearPersistedImport } from '../../services/persistence';
import { cleanupLocalCopy } from '../../utils/pickFile';

const useStatusScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const file = useSelector(selectedFileSelector);
  const job = useSelector(importJobSelector);
  const phase = useSelector(importPhaseSelector);
  const errorMessage = useSelector(importErrorSelector);
  const createKey = useSelector(importCreateKeySelector);
  const deleteKey = useSelector(importDeleteKeySelector);
  const maxRevision = useSelector(importMaxRevisionSelector);
  const tombstone = useSelector(importTombstoneSelector);
  const pollingRef = useRef(false);
  const stateRef = useRef<ResumedImport | null>(null);

  stateRef.current =
    createKey && deleteKey
      ? {
          selected: file,
          phase,
          createKey,
          deleteKey,
          job,
          maxRevision,
          tombstone,
          errorMessage,
        }
      : null;

  const shouldPoll =
    (phase === 'polling' || phase === 'deleting' || phase === 'recovering') &&
    Boolean(job?.jobId) &&
    Boolean(createKey) &&
    Boolean(deleteKey);

  useEffect(() => {
    if (!shouldPoll) {
      return;
    }

    let cancelled = false;

    const tick = async () => {
      if (pollingRef.current || cancelled || !stateRef.current) {
        return;
      }
      pollingRef.current = true;
      try {
        const next = await pollOnce(stateRef.current);
        if (cancelled) {
          return;
        }
        if (next.job) {
          dispatch(
            setImportJob({ job: next.job, maxRevision: next.maxRevision }),
          );
        }
        dispatch(setImportPhase(next.phase));
        if (next.errorMessage) {
          dispatch(setImportError(next.errorMessage));
        }
        if (next.phase === 'ready' && next.job?.status === 'ready') {
          navigation.navigate('Result');
        }
        if (next.job?.status === 'deleted' || next.phase === 'deleted') {
          await markDeletedComplete(next);
          dispatch(resetImport());
          dispatch(setSelectedFile(null));
          navigation.navigate('Home');
        }
      } catch {
      } finally {
        pollingRef.current = false;
      }
    };

    void tick();
    const id = setInterval(() => void tick(), POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [dispatch, navigation, shouldPoll]);

  const handleBack = useCallback(async () => {
    const uri = file?.localCopyUri;
    dispatch(resetImport());
    dispatch(setSelectedFile(null));
    navigation.navigate('Home');
    await clearPersistedImport();
    await cleanupLocalCopy(uri);
  }, [dispatch, file?.localCopyUri, navigation]);

  return {
    job,
    phase,
    errorMessage,
    handleBack,
  };
};

export default useStatusScreen;
