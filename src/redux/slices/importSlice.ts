import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ImportPhase, JobSnapshot } from '../../types/import';

export type ImportState = {
  phase: ImportPhase;
  createKey: string | null;
  deleteKey: string | null;
  job: JobSnapshot | null;
  errorMessage: string | null;
  keysReady: boolean;
  maxRevision: number;
  tombstone: boolean;
  resumeAvailable: boolean;
};

const initialState: ImportState = {
  phase: 'idle',
  createKey: null,
  deleteKey: null,
  job: null,
  errorMessage: null,
  keysReady: false,
  maxRevision: 0,
  tombstone: false,
  resumeAvailable: false,
};

type RestoreImportPayload = {
  phase: ImportPhase;
  createKey: string;
  deleteKey: string;
  job: JobSnapshot | null;
  maxRevision: number;
  tombstone: boolean;
  errorMessage: string | null;
  resumeAvailable?: boolean;
};

export const importSlice = createSlice({
  name: 'import',
  initialState,
  reducers: {
    resetImport: () => initialState,
    setImportKeys: (
      state,
      action: PayloadAction<{ createKey: string; deleteKey: string }>,
    ) => {
      state.createKey = action.payload.createKey;
      state.deleteKey = action.payload.deleteKey;
      state.keysReady = true;
      state.phase = 'confirming';
      state.errorMessage = null;
      state.resumeAvailable = false;
    },
    setImportPhase: (state, action: PayloadAction<ImportPhase>) => {
      state.phase = action.payload;
    },
    setImportJob: (
      state,
      action: PayloadAction<{ job: JobSnapshot; maxRevision?: number }>,
    ) => {
      state.job = action.payload.job;
      if (typeof action.payload.maxRevision === 'number') {
        state.maxRevision = action.payload.maxRevision;
      } else {
        state.maxRevision = Math.max(
          state.maxRevision,
          action.payload.job.revision,
        );
      }
      state.errorMessage = null;
    },
    setImportError: (state, action: PayloadAction<string>) => {
      state.phase = 'error';
      state.errorMessage = action.payload;
    },
    restoreImport: (state, action: PayloadAction<RestoreImportPayload>) => {
      state.phase = action.payload.phase;
      state.createKey = action.payload.createKey;
      state.deleteKey = action.payload.deleteKey;
      state.job = action.payload.job;
      state.maxRevision = action.payload.maxRevision;
      state.tombstone = action.payload.tombstone;
      state.errorMessage = action.payload.errorMessage;
      state.keysReady = true;
      state.resumeAvailable = action.payload.resumeAvailable ?? true;
    },
    clearResumeAvailable: state => {
      state.resumeAvailable = false;
    },
  },
});

export const {
  resetImport,
  setImportKeys,
  setImportPhase,
  setImportJob,
  setImportError,
  restoreImport,
  clearResumeAvailable,
} = importSlice.actions;

export default importSlice.reducer;
