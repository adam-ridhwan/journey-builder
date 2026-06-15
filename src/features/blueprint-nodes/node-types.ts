import { DefaultNode } from './DefaultNode';
import { FormNode } from './FormNode';

import type { DefaultNodeType } from './DefaultNode';
import type { FormNodeType } from './FormNode';
import type { NodeTypes } from '@xyflow/react';

export const FORM_NODE = 'formNode';
export const DEFAULT_NODE = 'defaultNode';

/**
 * Union of every custom node variant rendered on the canvas.
 * Add new node types here, e.g. `FormNodeType | DecisionNodeType | ...`.
 * React Flow discriminates on the node's `type` field, so each component
 * still receives its own precise `NodeProps`.
 */
export type AppNode = FormNodeType | DefaultNodeType;

/** Maps each node `type` string to the component that renders it. */
export const nodeTypes = {
  [FORM_NODE]: FormNode,
  [DEFAULT_NODE]: DefaultNode,
} satisfies NodeTypes;
