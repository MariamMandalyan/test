import { createNavigationContainerRef } from '@react-navigation/native';
import type { RootStackParamList } from './types';

export const rootNavigationRef =
  createNavigationContainerRef<RootStackParamList>();

export function navigate<Name extends keyof RootStackParamList>(
  name: Name,
  params?: RootStackParamList[Name],
) {
  if (rootNavigationRef.isReady()) {
    rootNavigationRef.navigate(name as never, params as never);
  }
}

export function resetToHome() {
  if (rootNavigationRef.isReady()) {
    rootNavigationRef.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  }
}

export function resetTo(
  name: keyof RootStackParamList,
  params?: RootStackParamList[keyof RootStackParamList],
) {
  if (rootNavigationRef.isReady()) {
    rootNavigationRef.reset({
      index: 0,
      routes: [{ name, params } as never],
    });
  }
}
