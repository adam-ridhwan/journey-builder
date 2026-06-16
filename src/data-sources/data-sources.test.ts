import { formFieldSource } from './form-field-source';
import { GLOBAL_DATA, globalDataSource } from './global-data';
import { getDataSource, PREFILL_DATA_SOURCES } from './registry';
import { asFormNode, diamondGraph } from '@/test/graph-fixture';
import { describe, expect, it } from 'vitest';

import type { PrefillSource } from '@/features/prefill/prefill-slice';

const formD = asFormNode('form-d');

describe('PREFILL_DATA_SOURCES registry', () => {
  it('registers the form-field and global-data sources', () => {
    const types = PREFILL_DATA_SOURCES.map((source) => source.type);
    expect(types).toContain('form-field');
    expect(types).toContain('global-data');
  });

  it('has exactly one provider per source type', () => {
    const types = PREFILL_DATA_SOURCES.map((source) => source.type);
    expect(new Set(types).size).toBe(types.length);
  });

  it('looks up a provider by type', () => {
    expect(getDataSource('global-data')).toBe(globalDataSource);
    expect(getDataSource('form-field')).toBe(formFieldSource);
  });

  it('returns undefined for an unregistered type', () => {
    expect(getDataSource('nope' as PrefillSource['type'])).toBeUndefined();
  });
});

describe('formFieldSource', () => {
  it('offers direct and transitive upstream forms as badged groups', () => {
    const groups = formFieldSource.getOptionGroups({
      graph: diamondGraph,
      node: formD,
    });
    const byTitle = Object.fromEntries(groups.map((g) => [g.title, g]));
    expect(byTitle['Form B'].badge).toBe('direct');
    expect(byTitle['Form A'].badge).toBe('transitive');
  });

  it('exposes each upstream field as a selectable option carrying its source', () => {
    const groups = formFieldSource.getOptionGroups({
      graph: diamondGraph,
      node: formD,
    });
    const formA = groups.find((g) => g.title === 'Form A');
    expect(formA?.options.map((o) => o.label).sort()).toEqual([
      'email',
      'name',
    ]);
    expect(formA?.options.find((o) => o.label === 'email')?.source).toEqual({
      type: 'form-field',
      label: 'Form A.email',
      sourceNodeId: 'form-a',
      sourceFieldKey: 'email',
    });
  });

  it('resolves to the value of the upstream form field', () => {
    const value = formFieldSource.resolve(
      {
        type: 'form-field',
        label: 'Form A.email',
        sourceNodeId: 'form-a',
        sourceFieldKey: 'email',
      },
      { formData: { 'form-a': { email: 'ada@x.com' } } }
    );
    expect(value).toBe('ada@x.com');
  });

  it('returns undefined for a source it does not own', () => {
    const value = formFieldSource.resolve(
      { type: 'global-data', label: 'x', sourceKey: 'org.id' },
      { formData: {} }
    );
    expect(value).toBeUndefined();
  });
});

describe('globalDataSource', () => {
  it('offers every global namespace as a group tagged "global"', () => {
    const groups = globalDataSource.getOptionGroups({
      graph: diamondGraph,
      node: formD,
    });
    expect(groups.map((g) => g.title)).toEqual(
      GLOBAL_DATA.map((ns) => ns.title)
    );
    expect(groups.every((g) => g.badge === 'global')).toBe(true);
  });

  it('resolves a value by its key', () => {
    const value = globalDataSource.resolve(
      {
        type: 'global-data',
        label: 'Organization Name',
        sourceKey: 'org.name',
      },
      { formData: {} }
    );
    expect(value).toBe('Avantos, Inc.');
  });

  it('returns undefined for an unknown key', () => {
    const value = globalDataSource.resolve(
      { type: 'global-data', label: 'x', sourceKey: 'does.not.exist' },
      { formData: {} }
    );
    expect(value).toBeUndefined();
  });

  it('returns undefined for a source it does not own', () => {
    const value = globalDataSource.resolve(
      {
        type: 'form-field',
        label: 'x',
        sourceNodeId: 'a',
        sourceFieldKey: 'b',
      },
      { formData: {} }
    );
    expect(value).toBeUndefined();
  });
});
