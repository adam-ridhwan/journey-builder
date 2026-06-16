import { getDataSource } from '@/data-sources/registry';

import type { ResolveContext } from '@/data-sources/types';
import type { PrefillSource } from '@/features/prefill/prefill-slice';

/**
 * Resolve a prefill source to its concrete value by delegating to the data
 * source that owns its `type`. New data sources are handled automatically once
 * registered in `PREFILL_DATA_SOURCES` — this function never needs to change.
 */
export function resolvePrefillValue(
  source: PrefillSource,
  ctx: ResolveContext
): unknown {
  return getDataSource(source.type)?.resolve(source, ctx);
}
