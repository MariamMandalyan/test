import { MAX_FILE_BYTES } from '../config';

export type DetectedFormat = 'pdf' | 'csv';

export type ValidationOk = {
  ok: true;
  format: DetectedFormat;
};

export type ValidationFail = {
  ok: false;
  reason: 'oversize' | 'unsupported' | 'empty';
  message: string;
};

export type ValidationResult = ValidationOk | ValidationFail;

export function detectFormat(bytes: Uint8Array): DetectedFormat | null {
  if (bytes.length >= 5) {
    const head = String.fromCharCode(
      bytes[0],
      bytes[1],
      bytes[2],
      bytes[3],
      bytes[4],
    );
    if (head === '%PDF-') {
      return 'pdf';
    }
  }

  const sampleLen = Math.min(bytes.length, 64);
  let text = '';
  for (let i = 0; i < sampleLen; i += 1) {
    text += String.fromCharCode(bytes[i]);
  }
  const normalized = text.replace(/\r/g, '');
  if (normalized.startsWith('date,description,amount\n')) {
    return 'csv';
  }
  return null;
}

export function validateSelectedFile(params: {
  size: number;
  headBytes: Uint8Array;
}): ValidationResult {
  if (params.size <= 0) {
    return { ok: false, reason: 'empty', message: 'Файл пустой.' };
  }
  if (params.size > MAX_FILE_BYTES) {
    return {
      ok: false,
      reason: 'oversize',
      message: `Файл больше 10 МиБ (${params.size} байт). Отклонён до отправки.`,
    };
  }
  const format = detectFormat(params.headBytes);
  if (!format) {
    return {
      ok: false,
      reason: 'unsupported',
      message:
        'Содержимое не является корректным PDF или CSV. Отклонено до отправки.',
    };
  }
  return { ok: true, format };
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(2)} MiB`;
}
