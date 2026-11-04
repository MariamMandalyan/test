import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootStackParamList } from '../../navigation/types';
import { selectedFileSelector } from '../../redux/selectors/administrativeSelector';
import {
  importCreateKeySelector,
  importDeleteKeySelector,
  importKeysReadySelector,
} from '../../redux/selectors/importSelector';
import {
  setSelectedFile,
  showWarningModal,
} from '../../redux/slices/administrativeSlice';
import {
  resetImport,
  setImportError,
  setImportJob,
  setImportKeys,
  setImportPhase,
} from '../../redux/slices/importSlice';
import type { AppDispatch } from '../../redux/store';
import { ApiError, createImport } from '../../services/api';
import {
  clearPersistedImport,
  createIdempotencyKey,
  savePersistedImport,
} from '../../services/persistence';
import { cleanupLocalCopy, readFileBytes } from '../../utils/pickFile';

const useConfirmScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const file = useSelector(selectedFileSelector);
  const keysReady = useSelector(importKeysReadySelector);
  const createKey = useSelector(importCreateKeySelector);
  const deleteKey = useSelector(importDeleteKeySelector);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!file || keysReady) {
      return;
    }

    const prepareKeys = async () => {
      const nextCreateKey = createIdempotencyKey('create');
      const nextDeleteKey = createIdempotencyKey('delete');
      dispatch(
        setImportKeys({
          createKey: nextCreateKey,
          deleteKey: nextDeleteKey,
        }),
      );
      await savePersistedImport({
        createKey: nextCreateKey,
        deleteKey: nextDeleteKey,
        fileName: file.name,
        format: file.format,
        fileSize: file.size,
        localCopyUri: file.localCopyUri,
        jobId: null,
        phase: 'confirming',
        maxRevision: 0,
        lastStatus: null,
        result: null,
        tombstone: false,
        updatedAt: Date.now(),
      });
    };

    void prepareKeys();
  }, [dispatch, file, keysReady]);

  const handleBack = useCallback(async () => {
    const uri = file?.localCopyUri;
    dispatch(resetImport());
    dispatch(setSelectedFile(null));
    navigation.navigate('Home');
    await clearPersistedImport();
    await cleanupLocalCopy(uri);
  }, [dispatch, file?.localCopyUri, navigation]);

  const handleConfirm = useCallback(async () => {
    if (!file || !createKey || !deleteKey || uploading) {
      return;
    }

    setUploading(true);
    dispatch(setImportPhase('uploading'));

    try {
      const bytes = await readFileBytes(file.localCopyUri);
      const job = await createImport({
        bytes,
        createKey,
        fileName: file.name,
      });

      dispatch(setImportJob({ job, maxRevision: job.revision }));
      dispatch(setImportPhase('polling'));
      await savePersistedImport({
        createKey,
        deleteKey,
        fileName: file.name,
        format: file.format,
        fileSize: file.size,
        localCopyUri: file.localCopyUri,
        jobId: job.jobId,
        phase: 'polling',
        maxRevision: job.revision,
        lastStatus: job.status,
        result: job,
        tombstone: false,
        updatedAt: Date.now(),
      });
      navigation.navigate('Status');
    } catch (error) {
      const message =
        error instanceof ApiError
          ? `Ошибка отправки (${error.status}). 202 ещё не означает готовый отчёт.`
          : error instanceof Error
            ? error.message
            : 'Не удалось отправить файл.';
      dispatch(setImportError(message));
      dispatch(
        showWarningModal({
          title: 'Ошибка отправки',
          description: message,
          actionButtons: [{ label: 'OK' }],
        }),
      );
    } finally {
      setUploading(false);
    }
  }, [createKey, deleteKey, dispatch, file, navigation, uploading]);

  return {
    file,
    keysReady,
    uploading,
    handleBack,
    handleConfirm,
  };
};

export default useConfirmScreen;
