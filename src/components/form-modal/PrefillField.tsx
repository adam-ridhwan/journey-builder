import { getScopeKey } from '@/utils/resolve-scope';

import type { UiSchemaElement } from '@/api/blueprint-graph/blueprint-graph-types';

type PrefillFieldProps = {
  element: UiSchemaElement;
  /** Mapped source label (e.g. `Form A.email`); undefined when unmapped. */
  source?: string;
  onSelect: () => void;
};

/**
 * One field's prefill row.
 * - Unmapped: dashed row with the field name; click to pick a source.
 * - Mapped: shows `fieldKey: source`.
 */
export function PrefillField({ element, source, onSelect }: PrefillFieldProps) {
  const fieldKey = getScopeKey(element.scope);

  return (
    <button
      type='button'
      className={`prefill-field ${source ? 'prefill-field--mapped' : 'prefill-field--empty'}`}
      onClick={onSelect}
    >
      <span className='prefill-field__text'>
        <span className='prefill-field__key'>{fieldKey}</span>
        {source && <span className='prefill-field__source'>{source}</span>}
      </span>
    </button>
  );
}
