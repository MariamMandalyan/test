import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import {
  setSelectedFile,
  showWarningModal,
} from '../../redux/slices/administrativeSlice';
import {
  resetImport,
  setImportError,
  setImportJob,
  setImportPhase,
} from '../../redux/slices/importSlice';
import type { AppDispatch } from '../../redux/store';
import type { RecurringItem } from '../../types/import';
import {
  formatAmountAud,
  monthlyTotalMinor,
} from '../../services/fileValidation';
import { requestDelete, type ResumedImport } from '../../services/importJob';
import { clearPersistedImport } from '../../services/persistence';
import { cleanupLocalCopy } from '../../utils/pickFile';

const useResultScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const job = useSelector(importJobSelector);
  const file = useSelector(selectedFileSelector);
  const createKey = useSelector(importCreateKeySelector);
  const deleteKey = useSelector(importDeleteKeySelector);
  const phase = useSelector(importPhaseSelector);
  const maxRevision = useSelector(importMaxRevisionSelector);
  const tombstone = useSelector(importTombstoneSelector);
  const errorMessage = useSelector(importErrorSelector);
  const [deleting, setDeleting] = useState(false);

  const items = job?.items ?? [];
  const currency = job?.currency ?? 'AUD';
  const revision = job?.revision;

  const totalLabel = useMemo(() => {
    const total = monthlyTotalMinor(items);
    const amount =
      currency === 'AUD'
        ? formatAmountAud(total)
        : `${(total / 100).toFixed(2)} ${currency}`;
    return `Валюта: ${currency}\nСумма / мес: ${amount}${
      revision != null ? `\nRevision: ${revision}` : ''
    }`;
  }, [currency, items, revision]);

  const handleOpenDetail = useCallback(
    (item: RecurringItem) => {
      navigation.navigate('Detail', { item });
    },
    [navigation],
  );

  const handleDelete = useCallback(async () => {
    if (!job || !createKey || !deleteKey || deleting) {
      return;
    }

    setDeleting(true);
    try {
      const current: ResumedImport = {
        selected: file,
        phase,
        createKey,
        deleteKey,
        job,
        maxRevision,
        tombstone,
        errorMessage,
      };
      const next = await requestDelete(current);

      if (next.job) {
        dispatch(
          setImportJob({ job: next.job, maxRevision: next.maxRevision }),
        );
      }
      dispatch(setImportPhase(next.phase));

      if (next.errorMessage) {
        dispatch(setImportError(next.errorMessage));
        dispatch(
          showWarningModal({
            title: 'Удаление не подтверждено',
            description: next.errorMessage,
            actionButtons: [{ label: 'OK' }],
          }),
        );
        return;
      }

      navigation.navigate('Status');
    } finally {
      setDeleting(false);
    }
  }, [
    createKey,
    deleteKey,
    deleting,
    dispatch,
    errorMessage,
    file,
    job,
    maxRevision,
    navigation,
    phase,
    tombstone,
  ]);

  const handleBack = useCallback(async () => {
    const uri = file?.localCopyUri;
    dispatch(resetImport());
    dispatch(setSelectedFile(null));
    navigation.navigate('Home');
    await clearPersistedImport();
    await cleanupLocalCopy(uri);
  }, [dispatch, file?.localCopyUri, navigation]);

  return {
    items,
    totalLabel,
    deleting,
    handleOpenDetail,
    handleDelete,
    handleBack,
  };
};

export default useResultScreen;
