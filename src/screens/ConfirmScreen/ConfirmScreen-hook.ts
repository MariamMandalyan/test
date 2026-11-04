import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectedFileSelector } from '../../redux/selectors/administrativeSelector';
import { goToHome } from '../../redux/slices/administrativeSlice';
import type { AppDispatch } from '../../redux/store';
import { cleanupLocalCopy } from '../../utils/pickFile';

const useConfirmScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const file = useSelector(selectedFileSelector);

  const handleBack = useCallback(async () => {
    const uri = file?.localCopyUri;
    dispatch(goToHome());
    await cleanupLocalCopy(uri);
  }, [dispatch, file?.localCopyUri]);

  const handleConfirm = useCallback(() => {}, []);

  return {
    file,
    handleBack,
    handleConfirm,
  };
};

export default useConfirmScreen;
