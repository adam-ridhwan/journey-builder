import type { PrefillDataSource } from './types';

/** A single global value available to prefill any form. */
type GlobalDataField = {
  /** Stable key persisted on the mapping and used to resolve the value. */
  key: string;
  /** User-facing label shown in the picker. */
  label: string;
  /** The value used to prefill the target field. */
  value: unknown;
};

/** A namespace of related global values, shown as one group in the picker. */
type GlobalDataNamespace = {
  id: string;
  title: string;
  fields: GlobalDataField[];
};

/**
 * Global data available to every form, independent of the DAG. The challenge
 * lets us substitute "whatever global data we want" for the real Action and
 * Client Organization properties — these are representative stand-ins.
 *
 * To expose more global data, add a field or namespace here: the picker and the
 * resolver pick it up automatically.
 */
export const GLOBAL_DATA: GlobalDataNamespace[] = [
  {
    id: 'action',
    title: 'Action Properties',
    fields: [
      { key: 'action.id', label: 'Action ID', value: 'act_01jk7ap2r3' },
      { key: 'action.name', label: 'Action Name', value: 'Onboard Customer' },
      {
        key: 'action.initiated_at',
        label: 'Initiated At',
        value: '2026-06-16T00:00:00Z',
      },
    ],
  },
  {
    id: 'organization',
    title: 'Client Organization Properties',
    fields: [
      { key: 'org.id', label: 'Organization ID', value: 'org_01habc123' },
      { key: 'org.name', label: 'Organization Name', value: 'Avantos, Inc.' },
      {
        key: 'org.contact_email',
        label: 'Contact Email',
        value: 'ops@avantos.example',
      },
    ],
  },
];

/** Flat key → field lookup for O(1) resolution. */
const GLOBAL_FIELDS_BY_KEY = new Map(
  GLOBAL_DATA.flatMap((namespace) =>
    namespace.fields.map((field) => [field.key, field] as const)
  )
);

/**
 * Prefill from global data. Always available — it does not depend on the DAG, so
 * it ignores the target node and offers every namespace as a group.
 */
export const globalDataSource: PrefillDataSource = {
  type: 'global-data',

  getOptionGroups() {
    return GLOBAL_DATA.map((namespace) => ({
      id: namespace.id,
      title: namespace.title,
      badge: 'global',
      options: namespace.fields.map((field) => ({
        id: field.key,
        label: field.label,
        source: {
          type: 'global-data' as const,
          label: field.label,
          sourceKey: field.key,
        },
      })),
    }));
  },

  resolve(source) {
    if (source.type !== 'global-data') return undefined;
    return GLOBAL_FIELDS_BY_KEY.get(source.sourceKey)?.value;
  },
};
