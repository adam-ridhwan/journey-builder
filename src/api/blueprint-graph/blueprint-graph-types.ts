/**
 * Types for the `action-blueprint-graph-get` response.
 * Mirrors the shape returned by the mock server's graph.json.
 */

/** Avantos-specific widget type. Open string union so unknown types don't break parsing. */
export type AvantosType =
  | 'button'
  | 'checkbox-group'
  | 'object-enum'
  | 'short-text'
  | 'multi-select'
  | 'multi-line-text'
  | (string & {});

/** JSON-schema-like description of a single form field. */
export interface FieldSchemaProperty {
  avantos_type: AvantosType;
  type: string;
  title?: string;
  format?: string;
  items?: { enum?: string[]; type?: string };
  enum?: unknown[] | null;
  uniqueItems?: boolean;
}

export interface FormFieldSchema {
  type: 'object';
  properties: Record<string, FieldSchemaProperty>;
  required?: string[];
}

export type UiSchemaScope = `#/properties/${string}`;

/** Layout container element types that hold nested `elements`. */
export type UiSchemaLayoutType =
  | 'VerticalLayout'
  | 'HorizontalLayout'
  | 'Group';

/** A leaf element bound to a single field via `scope` (rendered control or button). */
export interface UiSchemaControl {
  type: 'Control' | 'Button';
  scope: UiSchemaScope;
  label?: string;
  options?: {
    format?: string;
    [key: string]: unknown;
  };
}

/** A layout container holding nested elements (may nest other layouts). */
export interface UiSchemaLayout {
  type: UiSchemaLayoutType;
  elements: UiSchemaElement[];
  label?: string;
}

/** Any node in the UI schema tree: a layout container or a leaf control/button. */
export type UiSchemaElement = UiSchemaLayout | UiSchemaControl;

/** Root of a form's UI schema (typically a layout). Drives field order and labels. */
export type UiSchema = UiSchemaLayout;

/** A reusable form definition. Referenced by nodes via `component_id`. */
export interface FormDefinition {
  id: string;
  name: string;
  description?: string;
  is_reusable?: boolean;
  field_schema: FormFieldSchema;
  ui_schema?: UiSchema;
  dynamic_field_config?: Record<string, unknown>;
}

/** Per-node metadata. `prerequisites` lists the upstream node ids this node depends on. */
export interface NodeData {
  id: string;
  component_key: string;
  component_type: string;
  component_id: string;
  name: string;
  prerequisites: string[];
  permitted_roles?: string[];
  input_mapping?: Record<string, unknown>;
  sla_duration?: { number: number; unit: string };
  approval_required?: boolean;
  approval_roles?: string[];
}

/** A node in the DAG. `id` is the node id (e.g. "form-0f58384c-..."). */
export interface GraphNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: NodeData;
}

/** A directed edge: `source` is a prerequisite of `target`. */
export interface GraphEdge {
  source: string;
  target: string;
}

export interface BlueprintGraph {
  $schema?: string;
  id: string;
  tenant_id: string;
  name: string;
  description?: string;
  category?: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
  forms: FormDefinition[];
  branches?: unknown[];
  triggers?: unknown[];
}
