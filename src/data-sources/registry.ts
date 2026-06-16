import { formFieldSource } from './form-field-source';
import { globalDataSource } from './global-data';

import type { PrefillDataSource } from './types';

/**
 * Every prefill data source the UI offers, in display order.
 *
 * To add a new source (another API, a constants table, computed values, …),
 * implement `PrefillDataSource` and add it to this array. The picker modal
 * (`PrefillModal`) and the value resolver (`resolvePrefillValue`) consume this
 * list directly, so no other code needs to change.
 */
export const PREFILL_DATA_SOURCES: PrefillDataSource[] = [
  formFieldSource,
  globalDataSource,
];

/** Look up the data source that owns a given `PrefillSource` variant. */
export function getDataSource(type: PrefillDataSource['type']) {
  return PREFILL_DATA_SOURCES.find((source) => source.type === type);
}
