import {
  clearNodePrefillMappings,
  clearPrefillMapping,
  prefillReducer,
  setPrefillMapping,
} from './prefill-slice';
import { describe, expect, it } from 'vitest';

import type { PrefillSource } from './prefill-slice';

const formFieldSource: PrefillSource = {
  type: 'form-field',
  label: 'Form A.email',
  sourceNodeId: 'form-a',
  sourceFieldKey: 'email',
};

const globalSource: PrefillSource = {
  type: 'global-data',
  label: 'Organization Name',
  sourceKey: 'org.name',
};

const initialState = { mappings: {} };

describe('prefillReducer', () => {
  it('maps a field to a source', () => {
    const state = prefillReducer(
      initialState,
      setPrefillMapping({
        nodeId: 'd',
        fieldKey: 'email',
        source: formFieldSource,
      })
    );
    expect(state.mappings.d.email).toEqual(formFieldSource);
  });

  it('supports different data source variants on the same node', () => {
    let state = prefillReducer(
      initialState,
      setPrefillMapping({
        nodeId: 'd',
        fieldKey: 'email',
        source: formFieldSource,
      })
    );
    state = prefillReducer(
      state,
      setPrefillMapping({ nodeId: 'd', fieldKey: 'org', source: globalSource })
    );
    expect(state.mappings.d.email).toEqual(formFieldSource);
    expect(state.mappings.d.org).toEqual(globalSource);
  });

  it('overwrites an existing field mapping', () => {
    let state = prefillReducer(
      initialState,
      setPrefillMapping({
        nodeId: 'd',
        fieldKey: 'email',
        source: formFieldSource,
      })
    );
    state = prefillReducer(
      state,
      setPrefillMapping({
        nodeId: 'd',
        fieldKey: 'email',
        source: globalSource,
      })
    );
    expect(state.mappings.d.email).toEqual(globalSource);
  });

  it('clears a single field mapping, leaving others intact', () => {
    let state = prefillReducer(
      initialState,
      setPrefillMapping({
        nodeId: 'd',
        fieldKey: 'email',
        source: formFieldSource,
      })
    );
    state = prefillReducer(
      state,
      setPrefillMapping({ nodeId: 'd', fieldKey: 'org', source: globalSource })
    );
    state = prefillReducer(
      state,
      clearPrefillMapping({ nodeId: 'd', fieldKey: 'email' })
    );
    expect(state.mappings.d.email).toBeUndefined();
    expect(state.mappings.d.org).toEqual(globalSource);
  });

  it('clears all mappings for a node', () => {
    let state = prefillReducer(
      initialState,
      setPrefillMapping({
        nodeId: 'd',
        fieldKey: 'email',
        source: formFieldSource,
      })
    );
    state = prefillReducer(state, clearNodePrefillMappings({ nodeId: 'd' }));
    expect(state.mappings.d).toBeUndefined();
  });

  it('treats clearing a missing mapping as a no-op', () => {
    const state = prefillReducer(
      initialState,
      clearPrefillMapping({ nodeId: 'x', fieldKey: 'y' })
    );
    expect(state.mappings).toEqual({});
  });
});
