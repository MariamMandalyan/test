import type { RootState } from '../store';

export const importPhaseSelector = (state: RootState) => state.import.phase;

export const importKeysReadySelector = (state: RootState) =>
  state.import.keysReady;

export const importCreateKeySelector = (state: RootState) =>
  state.import.createKey;

export const importDeleteKeySelector = (state: RootState) =>
  state.import.deleteKey;

export const importJobSelector = (state: RootState) => state.import.job;

export const importErrorSelector = (state: RootState) =>
  state.import.errorMessage;

export const importMaxRevisionSelector = (state: RootState) =>
  state.import.maxRevision;

export const importTombstoneSelector = (state: RootState) =>
  state.import.tombstone;

export const importResumeAvailableSelector = (state: RootState) =>
  state.import.resumeAvailable;
