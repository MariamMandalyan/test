import type { RootState } from '../store';

export const screenSelector = (state: RootState) =>
  state.administrative.screen;

export const selectedFileSelector = (state: RootState) =>
  state.administrative.selectedFile;

export const warningModalSelector = (state: RootState) =>
  state.administrative.warningModal;
