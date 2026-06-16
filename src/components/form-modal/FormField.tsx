import { getScopeKey } from '@/utils/resolve-scope';
import { Button, Checkbox, Input, Select } from 'antd';

import type {
  FormFieldSchema,
  UiSchemaElement,
} from '@/api/blueprint-graph/blueprint-graph-types';

type FormFieldProps = {
  element: UiSchemaElement;
  fieldSchema: FormFieldSchema;
  value: unknown;
  onChange: (value: unknown) => void;
};

/** Build antd Select/Checkbox options from a list of string values. */
function toOptions(values: readonly string[] = []) {
  return values.map((value) => ({ label: value, value }));
}

/** Keep only string entries from a loosely-typed enum (it may be `null`/mixed). */
function stringEnum(values: unknown[] | null | undefined): string[] {
  return (values ?? []).filter((v): v is string => typeof v === 'string');
}

export function FormField({
  element,
  fieldSchema,
  value,
  onChange,
}: FormFieldProps) {
  const scopeKey = getScopeKey(element.scope);
  const fieldSchemaProperty = fieldSchema.properties[scopeKey];
  const isRequired = fieldSchema.required?.includes(scopeKey) ?? false;
  const label = element.label ?? fieldSchemaProperty.title ?? '';

  // A button is an action, not a data field.
  if (fieldSchemaProperty.avantos_type === 'button') {
    return (
      <div className='form-field'>
        <Button>{label || 'Button'}</Button>
      </div>
    );
  }

  function renderControl() {
    switch (fieldSchemaProperty.avantos_type) {
      case 'short-text':
        return (
          <Input
            type={fieldSchemaProperty.format === 'email' ? 'email' : 'text'}
            placeholder={label}
            allowClear
            value={value as string | undefined}
            onChange={(e) => onChange(e.target.value)}
          />
        );

      case 'multi-line-text':
        return (
          <Input.TextArea
            rows={4}
            placeholder={label}
            allowClear
            value={value as string | undefined}
            onChange={(e) => onChange(e.target.value)}
          />
        );

      case 'checkbox-group':
        return (
          <Checkbox.Group
            options={toOptions(fieldSchemaProperty.items?.enum)}
            value={value as string[] | undefined}
            onChange={onChange}
          />
        );

      case 'multi-select':
        return (
          <Select
            mode='multiple'
            allowClear
            style={{ width: '100%' }}
            placeholder={label}
            options={toOptions(fieldSchemaProperty.items?.enum)}
            value={value as string[] | undefined}
            onChange={onChange}
          />
        );

      case 'object-enum':
        return (
          <Select
            allowClear
            style={{ width: '100%' }}
            placeholder={label}
            options={toOptions(stringEnum(fieldSchemaProperty.enum))}
            value={value as string | undefined}
            onChange={onChange}
          />
        );

      default:
        return null;
    }
  }

  return (
    <div className='form-field'>
      <label className='form-field__label'>
        {label}
        {isRequired && <span className='form-field__required'> *</span>}
      </label>
      {renderControl()}
    </div>
  );
}
