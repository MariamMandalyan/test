import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  navigate,
  resetTo,
  rootNavigationRef,
} from './navigation/rootNavigationRef';
import { setSelectedFile } from './redux/slices/administrativeSlice';
import { restoreImport } from './redux/slices/importSlice';
import type { AppDispatch } from './redux/store';
import { resumeFromStorage } from './services/importJob';

const useAppBootstrap = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    let cancelled = false;

    const openResumed = (
      screen: 'Result' | 'Status' | 'Confirm',
    ) => {
      const run = () => {
        if (!rootNavigationRef.isReady()) {
          return false;
        }
        if (screen === 'Confirm') {
          navigate('Confirm');
        } else {
          resetTo(screen);
        }
        return true;
      };

      if (run()) {
        return;
      }

      const id = setInterval(() => {
        if (cancelled || run()) {
          clearInterval(id);
        }
      }, 32);

      setTimeout(() => clearInterval(id), 4000);
    };

    const bootstrap = async () => {
      const resumed = await resumeFromStorage();
      if (cancelled || !resumed || resumed.phase === 'idle' || resumed.phase === 'deleted') {
        return;
      }

      dispatch(
        restoreImport({
          phase: resumed.phase,
          createKey: resumed.createKey,
          deleteKey: resumed.deleteKey,
          job: resumed.job,
          maxRevision: resumed.maxRevision,
          tombstone: resumed.tombstone,
          errorMessage: resumed.errorMessage,
          resumeAvailable: true,
        }),
      );

      if (resumed.selected) {
        dispatch(setSelectedFile(resumed.selected));
      }

      if (resumed.phase === 'ready' && resumed.job?.status === 'ready') {
        openResumed('Result');
        return;
      }

      if (
        resumed.phase === 'polling' ||
        resumed.phase === 'recovering' ||
        resumed.phase === 'uploading' ||
        resumed.phase === 'deleting' ||
        resumed.phase === 'error'
      ) {
        openResumed('Status');
        return;
      }

      if (resumed.phase === 'confirming' && resumed.selected) {
        openResumed('Confirm');
      }
    };

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, [dispatch]);
};

export default useAppBootstrap;
