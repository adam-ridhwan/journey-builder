import { getScopeKey } from '@/utils/resolve-scope';
import { Button, Checkbox, Form, Input, Select } from 'antd';

import type {
  FormFieldSchema,
  UiSchemaElement,
} from '@/api/blueprint-graph/blueprint-graph-types';

type FormFieldProps = {
  element: UiSchemaElement;
  fieldSchema: FormFieldSchema;
};

/** Build antd Select/Checkbox options from a list of string values. */
function toOptions(values: readonly string[] = []) {
  return values.map((value) => ({ label: value, value }));
}

/** Keep only string entries from a loosely-typed enum (it may be `null`/mixed). */
function stringEnum(values: unknown[] | null | undefined): string[] {
  return (values ?? []).filter((v): v is string => typeof v === 'string');
}

export function FormField({ element, fieldSchema }: FormFieldProps) {
  const scopeKey = getScopeKey(element.scope);
  const fieldSchemaProperty = fieldSchema.properties[scopeKey];
  const isRequired = fieldSchema.required?.includes(scopeKey) ?? false;
  const label = element.label ?? fieldSchemaProperty.title ?? '';

  // A button is an action, not a data field — no `name`/validation binding.
  if (fieldSchemaProperty.avantos_type === 'button') {
    return (
      <Form.Item label={label}>
        <Button>{label || 'Button'}</Button>
      </Form.Item>
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
          />
        );

      case 'multi-line-text':
        return <Input.TextArea rows={4} placeholder={label} allowClear />;

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
    <Form.Item
      label={label}
      name={scopeKey}
      rules={
        isRequired
          ? [{ required: true, message: `${label} is required` }]
          : undefined
      }
    >
      {renderControl()}
    </Form.Item>
  );
}
