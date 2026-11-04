import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { goToHome } from '../../redux/slices/administrativeSlice';
import type { AppDispatch } from '../../redux/store';

const useDiagnosticsScreen = () => {
  const dispatch = useDispatch<AppDispatch>();

  const handleBack = useCallback(() => {
    dispatch(goToHome());
  }, [dispatch]);

  return {
    handleBack,
  };
};

export default useDiagnosticsScreen;
