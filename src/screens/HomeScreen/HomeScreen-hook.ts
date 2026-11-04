import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  goToConfirm,
  goToDiagnostics,
  showWarningModal,
} from '../../redux/slices/administrativeSlice';
import type { AppDispatch } from '../../redux/store';
import { pickStatementFile } from '../../utils/pickFile';

const useHomeScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [picking, setPicking] = useState(false);

  const handlePickFile = useCallback(async () => {
    if (picking) {
      return;
    }
    setPicking(true);
    try {
      const result = await pickStatementFile();
      if (result.ok) {
        dispatch(goToConfirm(result.file));
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
  }, [dispatch, picking]);

  const handleOpenDiagnostics = useCallback(() => {
    dispatch(goToDiagnostics());
  }, [dispatch]);

  return {
    picking,
    handlePickFile,
    handleOpenDiagnostics,
  };
};

export default useHomeScreen;
