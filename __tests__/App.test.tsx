import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

jest.mock('@react-native-documents/picker', () => ({
  pick: jest.fn(),
  keepLocalCopy: jest.fn(),
  types: { pdf: 'application/pdf', csv: ['text/csv'], allFiles: '*/*' },
  errorCodes: { OPERATION_CANCELED: 'OPERATION_CANCELED' },
  isErrorWithCode: () => false,
}));

jest.mock('react-native-blob-util', () => ({
  __esModule: true,
  default: {
    fs: {
      dirs: { CacheDir: '/tmp' },
      slice: jest.fn(),
      readFile: jest.fn(),
      unlink: jest.fn(),
      exists: jest.fn(),
      stat: jest.fn(),
    },
  },
}));

import App from '../App';

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});
