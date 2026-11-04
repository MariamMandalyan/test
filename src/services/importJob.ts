import type {
  ImportPhase,
  JobSnapshot,
  PersistedImportState,
  SelectedFile,
} from '../types/import';
import { cleanupLocalCopy, readFileBytes } from '../utils/pickFile';
import * as api from './api';
import {
  clearPersistedImport,
  loadPersistedImport,
  savePersistedImport,
} from './persistence';
import { mergeJobSnapshot } from './revisions';

export type ResumedImport = {
  selected: SelectedFile | null;
  phase: ImportPhase;
  createKey: string;
  deleteKey: string;
  job: JobSnapshot | null;
  maxRevision: number;
  tombstone: boolean;
  errorMessage: string | null;
};

function phaseFromJob(
  status: JobSnapshot['status'],
  fallback: ImportPhase,
): ImportPhase {
  if (status === 'ready') {
    return 'ready';
  }
  if (status === 'deleting') {
    return 'deleting';
  }
  if (status === 'deleted') {
    return 'deleted';
  }
  if (status === 'error') {
    return 'error';
  }
  if (status === 'queued' || status === 'processing') {
    return 'polling';
  }
  return fallback;
}

function applyJob(
  current: ResumedImport,
  incoming: JobSnapshot,
  phaseHint: ImportPhase,
): ResumedImport {
  const merged = mergeJobSnapshot({
    previous: current.job,
    incoming,
    maxRevision: current.maxRevision,
    tombstone: current.tombstone,
  });

  if (!merged.snapshot) {
    return current;
  }

  return {
    ...current,
    job: merged.snapshot,
    maxRevision: merged.maxRevision,
    phase: phaseFromJob(merged.snapshot.status, phaseHint),
    errorMessage:
      merged.snapshot.status === 'error'
        ? 'Import failed on server.'
        : current.errorMessage,
  };
}

async function persistResumed(state: ResumedImport): Promise<void> {
  const payload: PersistedImportState = {
    createKey: state.createKey,
    deleteKey: state.deleteKey,
    fileName: state.selected?.name ?? 'statement.bin',
    format: state.selected?.format ?? 'csv',
    fileSize: state.selected?.size ?? 0,
    localCopyUri: state.selected?.localCopyUri ?? null,
    jobId: state.job?.jobId ?? null,
    phase: state.phase,
    maxRevision: state.maxRevision,
    lastStatus: state.job?.status ?? null,
    result: state.job,
    tombstone: state.tombstone,
    updatedAt: Date.now(),
  };
  await savePersistedImport(payload);
}

async function recoverAfterLostAck(
  state: ResumedImport,
  bytes: Uint8Array,
): Promise<ResumedImport> {
  if (!state.selected) {
    return {
      ...state,
      phase: 'error',
      errorMessage: 'Cannot recover: missing file copy.',
    };
  }

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const found = await api.getImportByKey(state.createKey);
    if (found) {
      const next = applyJob(state, found, 'polling');
      await persistResumed(next);
      return next;
    }
    try {
      const created = await api.createImport({
        bytes,
        createKey: state.createKey,
        fileName: state.selected.name,
      });
      const next = applyJob(state, created, 'polling');
      await persistResumed(next);
      return next;
    } catch {
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }

  const failed: ResumedImport = {
    ...state,
    phase: 'error',
    errorMessage: 'Could not recover import after lost acknowledgement.',
  };
  await persistResumed(failed);
  return failed;
}

export async function pollOnce(state: ResumedImport): Promise<ResumedImport> {
  if (state.tombstone || !state.job?.jobId) {
    return state;
  }

  const incoming = await api.getImport(state.job.jobId);
  const next = applyJob(state, incoming, state.phase);
  await persistResumed(next);
  return next;
}

export async function resumeFromStorage(): Promise<ResumedImport | null> {
  const saved = await loadPersistedImport();
  if (!saved) {
    return null;
  }

  let state: ResumedImport = {
    phase: saved.phase,
    selected: saved.localCopyUri
      ? {
          name: saved.fileName,
          size: saved.fileSize,
          uri: saved.localCopyUri,
          localCopyUri: saved.localCopyUri,
          format: saved.format,
        }
      : null,
    job: saved.result,
    maxRevision: saved.maxRevision,
    createKey: saved.createKey,
    deleteKey: saved.deleteKey,
    errorMessage: null,
    tombstone: saved.tombstone,
  };

  if (saved.tombstone || saved.phase === 'deleted') {
    return { ...state, phase: 'deleted', tombstone: true };
  }

  if (saved.jobId) {
    state = {
      ...state,
      job: saved.result ?? {
        jobId: saved.jobId,
        status: saved.lastStatus ?? 'queued',
        revision: saved.maxRevision || 1,
      },
      phase: saved.phase === 'ready' ? 'ready' : 'polling',
    };
    try {
      return await pollOnce(state);
    } catch {
      return state;
    }
  }

  if (saved.createKey) {
    state = { ...state, phase: 'recovering' };
    try {
      const found = await api.getImportByKey(saved.createKey);
      if (found) {
        const next = applyJob(state, found, 'polling');
        await persistResumed(next);
        return next;
      }
      if (saved.localCopyUri) {
        const bytes = await readFileBytes(saved.localCopyUri);
        return recoverAfterLostAck(state, bytes);
      }
    } catch {
      return {
        ...state,
        phase: 'error',
        errorMessage:
          'Resume failed. Use retry if the file copy is still available.',
      };
    }
  }

  return state;
}

export async function requestDelete(
  state: ResumedImport,
): Promise<ResumedImport> {
  if (!state.job?.jobId || !state.deleteKey) {
    return { ...state, errorMessage: 'Нечего удалять.' };
  }

  try {
    const deleting = await api.deleteImport({
      jobId: state.job.jobId,
      deleteKey: state.deleteKey,
    });
    const next = applyJob(
      { ...state, phase: 'deleting', errorMessage: null },
      deleting,
      'deleting',
    );
    await persistResumed(next);
    return next;
  } catch (error) {
    const message =
      error instanceof api.ApiError && error.status === 503
        ? 'Удаление временно не удалось (503). Данные на сервере НЕ удалены.'
        : 'Запрос удаления не удался. Данные на сервере НЕ удалены.';
    const next: ResumedImport = {
      ...state,
      phase: state.job.status === 'ready' ? 'ready' : state.phase,
      errorMessage: message,
    };
    await persistResumed(next);
    return next;
  }
}

export async function markDeletedComplete(
  state: ResumedImport,
): Promise<ResumedImport> {
  await cleanupLocalCopy(state.selected?.localCopyUri);
  await clearPersistedImport();
  return {
    ...state,
    phase: 'deleted',
    tombstone: true,
    selected: null,
    job: state.job ? { ...state.job, status: 'deleted' } : state.job,
  };
}
