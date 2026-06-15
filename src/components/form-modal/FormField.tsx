import { Button, Checkbox, Input, Select } from 'antd';

import type {
  FieldSchemaProperty,
  UiSchemaElement,
} from '@/api/blueprint-graph/blueprint-graph-types';

type FormFieldProps = {
  element: UiSchemaElement;
  fieldSchemaProperty: FieldSchemaProperty;
};

/** Build antd Select/Checkbox options from a list of string values. */
function toOptions(values: readonly string[] = []) {
  return values.map((value) => ({ label: value, value }));
}

/** Keep only string entries from a loosely-typed enum (it may be `null`/mixed). */
function stringEnum(values: unknown[] | null | undefined): string[] {
  return (values ?? []).filter((v): v is string => typeof v === 'string');
}

export function FormField({ element, fieldSchemaProperty }: FormFieldProps) {
  const label = element.label ?? fieldSchemaProperty.title ?? '';

  function renderControl() {
    switch (fieldSchemaProperty.avantos_type) {
      case 'button':
        return <Button>{label || 'Button'}</Button>;

      case 'short-text':
        return (
          <Input
            type={fieldSchemaProperty.format === 'email' ? 'email' : 'text'}
            placeholder={label}
          />
        );

      case 'multi-line-text':
        return <Input.TextArea rows={4} placeholder={label} />;

      case 'checkbox-group':
        return (
          <Checkbox.Group
            options={toOptions(fieldSchemaProperty.items?.enum)}
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
          />
        );

      case 'object-enum':
        return (
          <Select
            allowClear
            style={{ width: '100%' }}
            placeholder={label}
            options={toOptions(stringEnum(fieldSchemaProperty.enum))}
          />
        );

      default:
        return null;
    }
  }

  return (
    <div className='form-field'>
      <label>{label}</label>
      {renderControl()}
    </div>
  );
}
