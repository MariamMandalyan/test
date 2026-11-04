import type { RecurringItem } from '../types/import';

export type RootStackParamList = {
  Home: undefined;
  Confirm: undefined;
  Status: undefined;
  Result: undefined;
  Detail: { item: RecurringItem };
  Diagnostics: undefined;
};
