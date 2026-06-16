import type {
  BlueprintGraph,
  FormDefinition,
  GraphNode,
} from '@/api/blueprint-graph/blueprint-graph-types';
import type { FormNodeType } from '@/components/blueprint-nodes/FormNode';

/** Minimal description of a form node, expanded into graph/form structures. */
type FormSpec = {
  /** Node id, e.g. `form-a`. */
  id: string;
  name: string;
  /** Node ids this form depends on. */
  prerequisites: string[];
  /** Field keys on the form. */
  fields: string[];
};

function makeNode(spec: FormSpec): GraphNode {
  return {
    id: spec.id,
    type: 'form',
    position: { x: 0, y: 0 },
    data: {
      id: `${spec.id}-data`,
      component_key: spec.id,
      component_type: 'form',
      component_id: `${spec.id}-form`,
      name: spec.name,
      prerequisites: spec.prerequisites,
    },
  };
}

function makeForm(spec: FormSpec): FormDefinition {
  return {
    id: `${spec.id}-form`,
    name: spec.name,
    field_schema: {
      type: 'object',
      properties: Object.fromEntries(
        spec.fields.map((key) => [
          key,
          { avantos_type: 'short-text', type: 'string' },
        ])
      ),
    },
  };
}

/** Build a `BlueprintGraph` from form specs; edges are derived from prerequisites. */
export function buildGraph(specs: FormSpec[]): BlueprintGraph {
  return {
    id: 'bp_test',
    tenant_id: '1',
    name: 'Test Blueprint',
    nodes: specs.map(makeNode),
    edges: specs.flatMap((spec) =>
      spec.prerequisites.map((source) => ({ source, target: spec.id }))
    ),
    forms: specs.map(makeForm),
  };
}

/** A bare node usable where only `node.id` matters (the prefill data sources). */
export function asFormNode(id: string): FormNodeType {
  return { id } as unknown as FormNodeType;
}

/**
 * Diamond DAG matching the challenge:
 *   A → B → D
 *   A → C → D
 * D directly depends on B and C; transitively on A.
 */
export const diamondGraph = buildGraph([
  {
    id: 'form-a',
    name: 'Form A',
    prerequisites: [],
    fields: ['email', 'name'],
  },
  {
    id: 'form-b',
    name: 'Form B',
    prerequisites: ['form-a'],
    fields: ['address'],
  },
  {
    id: 'form-c',
    name: 'Form C',
    prerequisites: ['form-a'],
    fields: ['phone'],
  },
  {
    id: 'form-d',
    name: 'Form D',
    prerequisites: ['form-b', 'form-c'],
    fields: ['dynamic_checkbox_group', 'dynamic_object', 'email'],
  },
]);
