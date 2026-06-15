import { getScopeKey } from '@/utils/resolve-scope';

import type { UiSchemaElement } from '@/api/blueprint-graph/blueprint-graph-types';

type PrefillFieldProps = {
  element: UiSchemaElement;
  prefillMappings: Record<string, string | null>;
  onSelect: () => void;
};

/**
 * One field's prefill row.
 * - Unmapped: dashed row with an icon + field name; click to pick a source.
 * - Mapped: filled pill showing `fieldKey: source` with a clear button.
 */
export function PrefillField({
  element,
  prefillMappings,
  onSelect,
}: PrefillFieldProps) {
  const fieldKey = getScopeKey(element.scope);

  return (
    <button
      type='button'
      className='prefill-field prefill-field--empty'
      onClick={onSelect}
    >
      <span className='prefill-field__placeholder'>{fieldKey}</span>
    </button>
  );
}
