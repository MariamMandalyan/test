import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  detectFormat,
  validateSelectedFile,
} from '../src/services/fileValidation';

const fixtures = join(__dirname, '../../mobile-engineer-kit/fixtures');

function toBytes(buf: Buffer): Uint8Array {
  return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
}

test('accepts statement.csv by content header', () => {
  const bytes = toBytes(readFileSync(join(fixtures, 'statement.csv')));
  expect(detectFormat(bytes)).toBe('csv');
  expect(validateSelectedFile({ size: bytes.length, headBytes: bytes }).ok).toBe(
    true,
  );
});

test('accepts statement.pdf by %PDF- magic', () => {
  const bytes = toBytes(readFileSync(join(fixtures, 'statement.pdf')));
  expect(detectFormat(bytes)).toBe('pdf');
  const result = validateSelectedFile({
    size: bytes.length,
    headBytes: bytes.subarray(0, 64),
  });
  expect(result.ok).toBe(true);
});

test('rejects spoofed.pdf before POST', () => {
  const bytes = toBytes(readFileSync(join(fixtures, 'spoofed.pdf')));
  expect(detectFormat(bytes)).toBeNull();
  const result = validateSelectedFile({ size: bytes.length, headBytes: bytes });
  expect(result.ok).toBe(false);
  if (!result.ok) {
    expect(result.reason).toBe('unsupported');
  }
});

test('rejects oversize without needing full body semantics', () => {
  const head = new Uint8Array([100, 97, 116, 101]);
  const result = validateSelectedFile({
    size: 10 * 1024 * 1024 + 1,
    headBytes: head,
  });
  expect(result.ok).toBe(false);
  if (!result.ok) {
    expect(result.reason).toBe('oversize');
  }
});
