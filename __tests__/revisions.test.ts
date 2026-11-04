import { mergeJobSnapshot } from '../src/services/revisions';
import type { JobSnapshot } from '../src/types/import';

const ready: JobSnapshot = {
  jobId: 'job-1',
  status: 'ready',
  revision: 3,
  currency: 'AUD',
  items: [],
};

const staleProcessing: JobSnapshot = {
  jobId: 'job-1',
  status: 'processing',
  revision: 2,
};

test('ignores stale lower revision after ready', () => {
  const merged = mergeJobSnapshot({
    previous: ready,
    incoming: staleProcessing,
    maxRevision: 3,
    tombstone: false,
  });
  expect(merged.ignored).toBe(true);
  expect(merged.snapshot?.status).toBe('ready');
  expect(merged.maxRevision).toBe(3);
});

test('tombstone blocks resurrection', () => {
  const merged = mergeJobSnapshot({
    previous: ready,
    incoming: { ...ready, status: 'processing', revision: 4 },
    maxRevision: 3,
    tombstone: true,
  });
  expect(merged.ignored).toBe(true);
  expect(merged.snapshot?.status).toBe('ready');
});
