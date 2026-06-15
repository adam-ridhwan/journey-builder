import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { ReactNode } from 'react';

type ModalState = {
  isOpen: boolean;
  children: ReactNode;
  subModal: {
    isOpen: boolean;
    children: ReactNode;
  };
};

const modalSlice = createSlice({
  name: 'modalSlice',
  initialState: {
    isOpen: false,
    children: null,
    subModal: {
      isOpen: false,
      children: null,
    },
  } as ModalState,
  reducers: {
    openModal(state, action: PayloadAction<ReactNode>) {
      state.isOpen = true;
      state.children = action.payload;
    },
    closeModal(state) {
      state.isOpen = false;
      state.children = null;
      // Also close sub-modal when main modal closes
      state.subModal.isOpen = false;
      state.subModal.children = null;
    },
    openSubModal(state, action: PayloadAction<ReactNode>) {
      state.subModal.isOpen = true;
      state.subModal.children = action.payload;
    },
    closeSubModal(state) {
      state.subModal.isOpen = false;
      state.subModal.children = null;
    },
  },
});

export const { openModal, closeModal, openSubModal, closeSubModal } =
  modalSlice.actions;

export const modalReducer = modalSlice.reducer;
