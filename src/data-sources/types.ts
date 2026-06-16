import type { BlueprintGraph } from '@/api/blueprint-graph/blueprint-graph-types';
import type { FormNodeType } from '@/components/blueprint-nodes/FormNode';
import type { PrefillSource } from '@/features/prefill/prefill-slice';

/** All submitted form values, keyed by node id then field key. */
export type FormData = Record<string, Record<string, unknown>>;

/** What a data source needs to list the options it can offer for a target node. */
export type OptionsContext = {
  graph: BlueprintGraph;
  node: FormNodeType;
};

/** What a data source needs to resolve a chosen option to a concrete value. */
export type ResolveContext = {
  formData: FormData;
};

/** One selectable item in the picker. Choosing it persists `source`. */
export type PrefillOption = {
  id: string;
  label: string;
  source: PrefillSource;
};

/** A titled group of options shown together in the picker. */
export type PrefillOptionGroup = {
  id: string;
  title: string;
  /** Optional category tag, e.g. `direct`, `transitive`, `global`. */
  badge?: string;
  options: PrefillOption[];
};

/**
 * A pluggable prefill data source. Implement this and register it in
 * `PREFILL_DATA_SOURCES` to make its data available in the picker — the modal and
 * the value resolver consume it automatically, with no other code changes.
 */
export interface PrefillDataSource {
  type: PrefillSource['type'];
  getOptionGroups(ctx: OptionsContext): PrefillOptionGroup[];
  resolve(source: PrefillSource, ctx: ResolveContext): unknown;
}
