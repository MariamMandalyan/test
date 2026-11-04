import { configureStore } from '@reduxjs/toolkit';
import administrativeReducer from './slices/administrativeSlice';

export const store = configureStore({
  reducer: {
    administrative: administrativeReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['administrative/showWarningModal'],
        ignoredPaths: ['administrative.warningModal.actionButtons'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
