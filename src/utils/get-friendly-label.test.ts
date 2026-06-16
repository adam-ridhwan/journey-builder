import { describe, expect, it } from 'vitest';

import { getFriendlyLabel } from './get-friendly-label';

describe('getFriendlyLabel', () => {
  it('title-cases snake_case', () => {
    expect(getFriendlyLabel('multi_select')).toBe('Multi Select');
  });

  it('title-cases kebab-case', () => {
    expect(getFriendlyLabel('dynamic-object')).toBe('Dynamic Object');
  });

  it('collapses repeated separators', () => {
    expect(getFriendlyLabel('a__b--c')).toBe('A B C');
  });

  it('capitalizes a single word', () => {
    expect(getFriendlyLabel('email')).toBe('Email');
  });
});
