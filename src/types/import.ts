export type JobStatus =
  | 'queued'
  | 'processing'
  | 'ready'
  | 'error'
  | 'deleting'
  | 'deleted';

export type RecurringItem = {
  id: string;
  merchant: string;
  amountMinor: number;
  cadence: string;
  lastSeen: string;
};

export type JobSnapshot = {
  jobId: string;
  status: JobStatus;
  revision: number;
  currency?: string;
  items?: RecurringItem[];
  error?: string;
};

export type ScenarioMode = 'happy' | 'lost_ack' | 'stale_status' | 'delete_failure';

export type ImportPhase =
  | 'idle'
  | 'confirming'
  | 'uploading'
  | 'recovering'
  | 'polling'
  | 'ready'
  | 'deleting'
  | 'deleted'
  | 'error';

export type SelectedFile = {
  name: string;
  size: number;
  uri: string;
  localCopyUri: string;
  format: 'pdf' | 'csv';
};

export type PersistedImportState = {
  createKey: string;
  deleteKey: string;
  fileName: string;
  format: 'pdf' | 'csv';
  fileSize: number;
  localCopyUri: string | null;
  jobId: string | null;
  phase: ImportPhase;
  maxRevision: number;
  lastStatus: JobStatus | null;
  result: JobSnapshot | null;
  tombstone: boolean;
  updatedAt: number;
};
