import { resolvePrefillValue } from './resolve-prefill-value';
import { describe, expect, it } from 'vitest';

import type { PrefillSource } from '@/features/prefill/prefill-slice';

describe('resolvePrefillValue', () => {
  it('resolves a form-field source via the registry', () => {
    const source: PrefillSource = {
      type: 'form-field',
      label: 'Form A.email',
      sourceNodeId: 'form-a',
      sourceFieldKey: 'email',
    };
    const value = resolvePrefillValue(source, {
      formData: { 'form-a': { email: 'a@b.com' } },
    });
    expect(value).toBe('a@b.com');
  });

  it('resolves a global-data source via the registry', () => {
    const source: PrefillSource = {
      type: 'global-data',
      label: 'Organization Name',
      sourceKey: 'org.name',
    };
    expect(resolvePrefillValue(source, { formData: {} })).toBe('Avantos, Inc.');
  });

  it('returns undefined for an unregistered source type', () => {
    const source = { type: 'mystery', label: 'x' } as unknown as PrefillSource;
    expect(resolvePrefillValue(source, { formData: {} })).toBeUndefined();
  });
});
