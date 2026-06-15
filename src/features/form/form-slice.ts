import { createSlice } from '@reduxjs/toolkit';

import type { RootState } from '@/app/store';
import type { PayloadAction } from '@reduxjs/toolkit';

/** One node's form values, keyed by field name. */
type NodeFormData = Record<string, unknown>;

type FormState = {
  /** Form values per node: `{ [nodeId]: { [fieldKey]: value } }`. */
  formData: Record<string, NodeFormData>;
};

const formSlice = createSlice({
  name: 'formSlice',
  initialState: {
    formData: {},
  } as FormState,
  reducers: {
    /** Update a single field for a node (incremental edits). */
    updateFormData(
      state,
      action: PayloadAction<{ nodeId: string; key: string; value: unknown }>
    ) {
      const { nodeId, key, value } = action.payload;
      const nodeData = state.formData[nodeId] ?? {};
      nodeData[key] = value;
      state.formData[nodeId] = nodeData;
    },
    /** Replace a node's entire form data (e.g. commit on submit). */
    setFormData(
      state,
      action: PayloadAction<{ nodeId: string; data: NodeFormData }>
    ) {
      state.formData[action.payload.nodeId] = action.payload.data;
    },
  },
});

export const { updateFormData, setFormData } = formSlice.actions;

export const formReducer = formSlice.reducer;

/** Select the full `{ [nodeId]: data }` map. */
export function selectFormData(state: RootState): FormState['formData'] {
  return state.form.formData;
}

/**
 * Select one node's form data. Curried so it can be passed to `useAppSelector`:
 *   const data = useAppSelector(selectFormDataByNodeId(nodeId));
 */
export function selectFormDataByNodeId(nodeId: string) {
  return (state: RootState): FormState['formData'][string] =>
    state.form.formData[nodeId];
}
