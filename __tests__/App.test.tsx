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

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(async () => null),
    setItem: jest.fn(async () => undefined),
    removeItem: jest.fn(async () => undefined),
  },
}));

jest.mock('react-native-gesture-handler', () => {
  const ReactNative = require('react-native');
  return {
    GestureHandlerRootView: ReactNative.View,
    Swipeable: ReactNative.View,
    DrawerLayout: ReactNative.View,
    State: {},
    PanGestureHandler: ReactNative.View,
    BaseButton: ReactNative.View,
    RectButton: ReactNative.View,
    BorderlessButton: ReactNative.View,
  };
});

jest.mock('react-native-screens', () => {
  const ReactNative = require('react-native');
  return {
    enableScreens: jest.fn(),
    Screen: ReactNative.View,
    ScreenContainer: ReactNative.View,
    NativeScreen: ReactNative.View,
    NativeScreenContainer: ReactNative.View,
  };
});

import App from '../App';

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});
