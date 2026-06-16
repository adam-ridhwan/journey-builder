import type { PrefillSource } from '@/features/prefill/prefill-slice';

/** All submitted form values, keyed by node id then field key. */
type FormData = Record<string, Record<string, unknown>>;

/**
 * Resolve a prefill source to its concrete value.
 * Add a `case` per source `type` as new data sources are introduced — no other
 * code needs to change.
 */
export function resolvePrefillValue(
  source: PrefillSource,
  formData: FormData
): unknown {
  switch (source.type) {
    case 'form-field':
      return formData[source.sourceNodeId]?.[source.sourceFieldKey];
    default:
      return undefined;
  }
}
