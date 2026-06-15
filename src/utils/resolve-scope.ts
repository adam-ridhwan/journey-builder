import type {
  FieldSchemaProperty,
  FormFieldSchema,
  UiSchemaScope,
} from '@/api/blueprint-graph/blueprint-graph-types';

/**
 * Extract the property key from a UI schema `scope`.
 * `"#/properties/notes"` → `"notes"`.
 */
export function getScopeKey(scope: UiSchemaScope): string {
  return scope.replace(/^#\/properties\//, '');
}

/**
 * Resolve a UI schema `scope` to its field-schema property.
 * Returns `undefined` if the key isn't present in the schema.
 */
export function resolveScopeProperty(
  scope: UiSchemaScope,
  fieldSchema: FormFieldSchema
): FieldSchemaProperty | undefined {
  return fieldSchema.properties[getScopeKey(scope)];
}
