import type { RootState } from '../store';

export const selectedFileSelector = (state: RootState) =>
  state.administrative.selectedFile;

export const warningModalSelector = (state: RootState) =>
  state.administrative.warningModal;
