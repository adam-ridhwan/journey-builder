import { CloseOutlined } from '@ant-design/icons';
import { getScopeKey } from '@/utils/resolve-scope';

import type { UiSchemaElement } from '@/api/blueprint-graph/blueprint-graph-types';

type PrefillFieldProps = {
  element: UiSchemaElement;
  /** Mapped source label (e.g. `Form A.email`); undefined when unmapped. */
  source?: string;
  onSelect: () => void;
  onClear: () => void;
};

/**
 * One field's prefill row.
 * - Unmapped: dashed row with the field name; click to pick a source.
 * - Mapped: shows `fieldKey` + source; the × clears the mapping.
 */
export function PrefillField({
  element,
  source,
  onSelect,
  onClear,
}: PrefillFieldProps) {
  const fieldKey = getScopeKey(element.scope);

  // Unmapped: the whole row opens the source picker.
  if (!source) {
    return (
      <button
        type='button'
        className='prefill-field prefill-field--empty'
        onClick={onSelect}
      >
        <span className='prefill-field__text'>
          <span className='prefill-field__key'>{fieldKey}</span>
        </span>
      </button>
    );
  }

  // Mapped: the row re-opens the picker; the × clears the mapping.
  return (
    <div className='prefill-field prefill-field--mapped'>
      <button type='button' className='prefill-field__main' onClick={onSelect}>
        <span className='prefill-field__text'>
          <span className='prefill-field__key'>{fieldKey}</span>
          <span className='prefill-field__source'>{source}</span>
        </span>
      </button>
      <button
        type='button'
        className='prefill-field__clear'
        aria-label={`Clear ${fieldKey} mapping`}
        onClick={onClear}
      >
        <CloseOutlined />
      </button>
    </div>
  );
}
