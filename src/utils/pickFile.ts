import {
  errorCodes,
  isErrorWithCode,
  keepLocalCopy,
  pick,
  types,
} from '@react-native-documents/picker';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { MAX_FILE_BYTES } from '../config';
import type { SelectedFile } from '../types/import';
import { validateSelectedFile } from '../services/fileValidation';

const HEAD_BYTES = 64;

export type PickFileResult =
  | { ok: true; file: SelectedFile }
  | { ok: false; cancelled?: boolean; message: string };

function stripFileScheme(uri: string): string {
  return uri.startsWith('file://') ? uri.replace('file://', '') : uri;
}

function base64ToBytes(base64: string): Uint8Array {
  const binary = globalThis.atob(base64);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    out[i] = binary.charCodeAt(i);
  }
  return out;
}

async function readHeadBytes(localUri: string): Promise<Uint8Array> {
  const path = stripFileScheme(localUri);
  const tmp = `${ReactNativeBlobUtil.fs.dirs.CacheDir}/import-head-${Date.now()}.bin`;
  try {
    await ReactNativeBlobUtil.fs.slice(path, tmp, 0, HEAD_BYTES);
    const base64 = await ReactNativeBlobUtil.fs.readFile(tmp, 'base64');
    return base64ToBytes(base64);
  } finally {
    try {
      await ReactNativeBlobUtil.fs.unlink(tmp);
    } catch {}
  }
}

export async function cleanupLocalCopy(
  uri: string | null | undefined,
): Promise<void> {
  if (!uri) {
    return;
  }
  try {
    const path = stripFileScheme(uri);
    const exists = await ReactNativeBlobUtil.fs.exists(path);
    if (exists) {
      await ReactNativeBlobUtil.fs.unlink(path);
    }
  } catch {}
}

export async function pickStatementFile(): Promise<PickFileResult> {
  try {
    const [asset] = await pick({
      type: [types.pdf, types.csv, types.allFiles],
      allowMultiSelection: false,
      mode: 'import',
    });

    const name = asset.name || 'statement.bin';
    let size = typeof asset.size === 'number' ? asset.size : 0;

    if (size <= 0) {
      try {
        const stat = await ReactNativeBlobUtil.fs.stat(stripFileScheme(asset.uri));
        size = Number(stat.size) || 0;
      } catch {}
    }

    if (size > MAX_FILE_BYTES) {
      return {
        ok: false,
        message: `Файл больше 10 МиБ (${size} байт). Отклонён до отправки.`,
      };
    }

    const [copy] = await keepLocalCopy({
      files: [
        {
          uri: asset.uri,
          fileName: name.replace(/[^a-zA-Z0-9._-]/g, '_'),
        },
      ],
      destination: 'cachesDirectory',
    });

    if (copy.status !== 'success') {
      return {
        ok: false,
        message:
          copy.copyError || 'Не удалось скопировать файл в кэш приложения.',
      };
    }

    const localCopyUri = copy.localUri;

    if (size <= 0) {
      try {
        const stat = await ReactNativeBlobUtil.fs.stat(
          stripFileScheme(localCopyUri),
        );
        size = Number(stat.size) || 0;
      } catch {
        await cleanupLocalCopy(localCopyUri);
        return { ok: false, message: 'Не удалось прочитать размер файла.' };
      }
    }

    if (size > MAX_FILE_BYTES) {
      await cleanupLocalCopy(localCopyUri);
      return {
        ok: false,
        message: `Файл больше 10 МиБ (${size} байт). Отклонён до отправки.`,
      };
    }

    let head: Uint8Array;
    try {
      head = await readHeadBytes(localCopyUri);
    } catch {
      await cleanupLocalCopy(localCopyUri);
      return {
        ok: false,
        message: 'Не удалось прочитать байты файла для проверки.',
      };
    }

    const validation = validateSelectedFile({ size, headBytes: head });
    if (!validation.ok) {
      await cleanupLocalCopy(localCopyUri);
      return { ok: false, message: validation.message };
    }

    return {
      ok: true,
      file: {
        name,
        size,
        uri: asset.uri,
        localCopyUri,
        format: validation.format,
      },
    };
  } catch (error) {
    if (
      isErrorWithCode(error) &&
      error.code === errorCodes.OPERATION_CANCELED
    ) {
      return { ok: false, cancelled: true, message: 'Выбор отменён.' };
    }
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : 'Не удалось выбрать файл.',
    };
  }
}
