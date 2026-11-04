import type { JobSnapshot, JobStatus } from '../types/import';

const STATUS_RANK: Record<JobStatus, number> = {
  queued: 1,
  processing: 2,
  ready: 3,
  error: 3,
  deleting: 4,
  deleted: 5,
};

export function mergeJobSnapshot(params: {
  previous: JobSnapshot | null;
  incoming: JobSnapshot;
  maxRevision: number;
  tombstone: boolean;
}): { snapshot: JobSnapshot | null; maxRevision: number; ignored: boolean } {
  if (params.tombstone) {
    return {
      snapshot: params.previous,
      maxRevision: params.maxRevision,
      ignored: true,
    };
  }

  if (params.incoming.revision < params.maxRevision) {
    return {
      snapshot: params.previous,
      maxRevision: params.maxRevision,
      ignored: true,
    };
  }

  if (
    params.previous &&
    params.incoming.revision === params.maxRevision &&
    STATUS_RANK[params.incoming.status] < STATUS_RANK[params.previous.status]
  ) {
    return {
      snapshot: params.previous,
      maxRevision: params.maxRevision,
      ignored: true,
    };
  }

  const nextMax = Math.max(params.maxRevision, params.incoming.revision);
  return {
    snapshot: params.incoming,
    maxRevision: nextMax,
    ignored: false,
  };
}
