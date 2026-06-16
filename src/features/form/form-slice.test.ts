import { describe, expect, it } from 'vitest';

import {
  clearFormData,
  formReducer,
  setFormData,
  updateFormData,
} from './form-slice';

const initialState = { formData: {} };

describe('formReducer', () => {
  it('updates a single field incrementally', () => {
    let state = formReducer(
      initialState,
      updateFormData({ nodeId: 'a', key: 'email', value: 'x@y.com' })
    );
    state = formReducer(
      state,
      updateFormData({ nodeId: 'a', key: 'name', value: 'Ada' })
    );
    expect(state.formData.a).toEqual({ email: 'x@y.com', name: 'Ada' });
  });

  it('replaces a node’s data on set', () => {
    let state = formReducer(
      initialState,
      updateFormData({ nodeId: 'a', key: 'email', value: 'x@y.com' })
    );
    state = formReducer(
      state,
      setFormData({ nodeId: 'a', data: { name: 'Ada' } })
    );
    expect(state.formData.a).toEqual({ name: 'Ada' });
  });

  it('clears a node’s data', () => {
    let state = formReducer(
      initialState,
      setFormData({ nodeId: 'a', data: { name: 'Ada' } })
    );
    state = formReducer(state, clearFormData({ nodeId: 'a' }));
    expect(state.formData.a).toBeUndefined();
  });
});
