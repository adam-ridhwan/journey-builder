import { DEFAULT_NODE, FORM_NODE } from '../blueprint-nodes/node-types';
import { Position } from '@xyflow/react';

import type { DefaultNodeData } from '../blueprint-nodes/DefaultNode';
import type { FormNodeData } from '../blueprint-nodes/FormNode';
import type { AppNode } from '../blueprint-nodes/node-types';
import type {
  BlueprintGraph,
  GraphNode,
} from '@/api/blueprint-graph/blueprint-graph-types';
import type { Edge } from '@xyflow/react';

/**
 * Map a single API node to the right `AppNode` variant.
 * Branch on the API node's `type` (or `data.component_type`) to pick the
 * React Flow node type; each `case` returns a different node in the union.
 */
function toFlowNode(node: GraphNode): AppNode {
  switch (node.type) {
    case 'form':
      return {
        id: node.id,
        type: FORM_NODE,
        position: node.position,
        data: node.data as FormNodeData,
        sourcePosition: Position.Left,
        targetPosition: Position.Right,
      };

    default:
      return {
        id: node.id,
        type: DEFAULT_NODE,
        position: node.position,
        data: node.data as DefaultNodeData,
        sourcePosition: Position.Left,
        targetPosition: Position.Right,
      };
  }
}

/** Map API graph nodes to React Flow nodes. */
export function toFlowNodes(graph: BlueprintGraph): AppNode[] {
  return graph.nodes.map(toFlowNode);
}

/** Map API edges (source = prerequisite of target) to React Flow edges. */
export function toFlowEdges(graph: BlueprintGraph): Edge[] {
  return graph.edges.map((edge) => ({
    id: `${edge.source}->${edge.target}`,
    source: edge.source,
    target: edge.target,
  }));
}
