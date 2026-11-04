import { API_BASE_URL } from '../config';
import type { JobSnapshot, ScenarioMode } from '../types/import';

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

async function parseJson(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) {
    return null;
  }
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength,
  ) as ArrayBuffer;
}

export async function createImport(params: {
  bytes: Uint8Array;
  createKey: string;
  fileName: string;
}): Promise<JobSnapshot> {
  const response = await fetch(`${API_BASE_URL}/imports`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/octet-stream',
      'Idempotency-Key': params.createKey,
      'X-File-Name': params.fileName,
    },
    body: toArrayBuffer(params.bytes),
  });

  const body = await parseJson(response);
  if (response.status !== 202) {
    throw new ApiError('Create import failed', response.status, body);
  }
  return body as JobSnapshot;
}

export async function getImportByKey(
  createKey: string,
): Promise<JobSnapshot | null> {
  const response = await fetch(
    `${API_BASE_URL}/imports/by-key/${encodeURIComponent(createKey)}`,
  );
  if (response.status === 404) {
    return null;
  }
  const body = await parseJson(response);
  if (!response.ok) {
    throw new ApiError('Lookup by key failed', response.status, body);
  }
  return body as JobSnapshot;
}

export async function getImport(jobId: string): Promise<JobSnapshot> {
  const response = await fetch(
    `${API_BASE_URL}/imports/${encodeURIComponent(jobId)}`,
  );
  const body = await parseJson(response);
  if (!response.ok) {
    throw new ApiError('Get import failed', response.status, body);
  }
  return body as JobSnapshot;
}

export async function deleteImport(params: {
  jobId: string;
  deleteKey: string;
}): Promise<JobSnapshot> {
  const response = await fetch(
    `${API_BASE_URL}/imports/${encodeURIComponent(params.jobId)}`,
    {
      method: 'DELETE',
      headers: { 'Idempotency-Key': params.deleteKey },
    },
  );
  const body = await parseJson(response);
  if (response.status !== 202) {
    throw new ApiError('Delete import failed', response.status, body);
  }
  return body as JobSnapshot;
}

export async function setScenario(mode: ScenarioMode): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/__test/scenario`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mode }),
  });
  if (!response.ok) {
    throw new ApiError(
      'Failed to set scenario',
      response.status,
      await parseJson(response),
    );
  }
}

export async function resetMock(): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/__test/reset`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new ApiError(
      'Failed to reset mock',
      response.status,
      await parseJson(response),
    );
  }
}

export type MockState = {
  mode: ScenarioMode;
  stats: {
    createRequests: number;
    newJobs: number;
    duplicateHits: number;
    acceptedBytes: number;
    deleteRequests: number;
  };
};

export async function getMockState(): Promise<MockState> {
  const response = await fetch(`${API_BASE_URL}/__test/state`);
  const body = await parseJson(response);
  if (!response.ok) {
    throw new ApiError('Failed to read mock state', response.status, body);
  }
  return body as MockState;
}

export async function healthCheck(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
}
