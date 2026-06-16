import { createSlice } from '@reduxjs/toolkit';

import type { RootState } from '@/app/store';
import type { PayloadAction } from '@reduxjs/toolkit';

/**
 * Where a field's prefill value comes from. Tagged by `type` so new data
 * sources (global data, etc.) can be added as new variants without changing
 * existing ones. `label` is what the UI displays (e.g. `Form A.email`).
 */
export type PrefillSource = {
  type: 'form-field';
  label: string;
  /** Upstream node whose form supplies the value. */
  sourceNodeId: string;
  /** Field key within that upstream form. */
  sourceFieldKey: string;
};

/** A node's prefill config: field key → its source. */
type NodePrefill = Record<string, PrefillSource>;

type PrefillState = {
  /** Prefill mappings per node: `{ [nodeId]: { [fieldKey]: source } }`. */
  mappings: Record<string, NodePrefill>;
};

const prefillSlice = createSlice({
  name: 'prefillSlice',
  initialState: {
    mappings: {},
  } as PrefillState,
  reducers: {
    /** Map a single field to a source. */
    setPrefillMapping(
      state,
      action: PayloadAction<{
        nodeId: string;
        fieldKey: string;
        source: PrefillSource;
      }>
    ) {
      const { nodeId, fieldKey, source } = action.payload;
      const nodeMappings = state.mappings[nodeId] ?? {};
      nodeMappings[fieldKey] = source;
      state.mappings[nodeId] = nodeMappings;
    },
    /** Clear one field's mapping (the × button). */
    clearPrefillMapping(
      state,
      action: PayloadAction<{ nodeId: string; fieldKey: string }>
    ) {
      const { nodeId, fieldKey } = action.payload;
      delete state.mappings[nodeId]?.[fieldKey];
    },
  },
});

export const { setPrefillMapping, clearPrefillMapping } = prefillSlice.actions;

export const prefillReducer = prefillSlice.reducer;

/** Select a node's full field → source map. */
export function selectPrefillMappingsByNodeId(nodeId: string) {
  return (state: RootState): NodePrefill | undefined =>
    state.prefill.mappings[nodeId];
}

/** Select a single field's source for a node. */
export function selectPrefillSource(nodeId: string, fieldKey: string) {
  return (state: RootState): PrefillSource | undefined =>
    state.prefill.mappings[nodeId]?.[fieldKey];
}
