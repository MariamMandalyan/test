import AsyncStorage from '@react-native-async-storage/async-storage';
import type { PersistedImportState } from '../types/import';

const STORAGE_KEY = 'import.operation.v1';

export function createIdempotencyKey(prefix: string): string {
  const rand = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  return `${prefix}-${rand}`.slice(0, 128);
}

export async function loadPersistedImport(): Promise<PersistedImportState | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as PersistedImportState;
  } catch {
    return null;
  }
}

export async function savePersistedImport(
  state: PersistedImportState,
): Promise<void> {
  const next: PersistedImportState = { ...state, updatedAt: Date.now() };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export async function clearPersistedImport(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
