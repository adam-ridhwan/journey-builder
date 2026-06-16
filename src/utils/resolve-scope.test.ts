import { getScopeKey, resolveScopeProperty } from './resolve-scope';
import { describe, expect, it } from 'vitest';

import type { FormFieldSchema } from '@/api/blueprint-graph/blueprint-graph-types';

describe('getScopeKey', () => {
  it('strips the #/properties/ prefix', () => {
    expect(getScopeKey('#/properties/email')).toBe('email');
  });

  it('preserves keys containing underscores', () => {
    expect(getScopeKey('#/properties/dynamic_checkbox_group')).toBe(
      'dynamic_checkbox_group'
    );
  });
});

describe('resolveScopeProperty', () => {
  const schema: FormFieldSchema = {
    type: 'object',
    properties: {
      email: { avantos_type: 'short-text', type: 'string', format: 'email' },
    },
  };

  it('returns the matching field property', () => {
    expect(resolveScopeProperty('#/properties/email', schema)?.format).toBe(
      'email'
    );
  });

  it('returns undefined when the key is absent', () => {
    expect(
      resolveScopeProperty('#/properties/missing', schema)
    ).toBeUndefined();
  });
});
