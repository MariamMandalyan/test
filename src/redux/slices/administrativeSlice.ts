import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { SelectedFile } from '../../types/import';

export type WarningActionButton = {
  label: string;
  variant?: 'primary' | 'secondary' | 'danger';
  onPress?: () => void;
};

export type WarningModalState = {
  visible: boolean;
  title: string;
  description: string;
  actionButtons: WarningActionButton[];
};

export type AdministrativeState = {
  selectedFile: SelectedFile | null;
  warningModal: WarningModalState;
};

const emptyWarningModal = (): WarningModalState => ({
  visible: false,
  title: '',
  description: '',
  actionButtons: [],
});

const initialState: AdministrativeState = {
  selectedFile: null,
  warningModal: emptyWarningModal(),
};

type ShowWarningPayload = {
  title: string;
  description: string;
  actionButtons?: WarningActionButton[];
};

export const administrativeSlice = createSlice({
  name: 'administrative',
  initialState,
  reducers: {
    setSelectedFile: (state, action: PayloadAction<SelectedFile | null>) => {
      state.selectedFile = action.payload;
    },
    showWarningModal: (state, action: PayloadAction<ShowWarningPayload>) => {
      const { title, description, actionButtons } = action.payload;
      state.warningModal = {
        visible: true,
        title,
        description,
        actionButtons:
          actionButtons && actionButtons.length > 0
            ? actionButtons
            : [{ label: 'OK' }],
      };
    },
    hideWarningModal: state => {
      state.warningModal = emptyWarningModal();
    },
  },
});

export const { setSelectedFile, showWarningModal, hideWarningModal } =
  administrativeSlice.actions;

export default administrativeSlice.reducer;
