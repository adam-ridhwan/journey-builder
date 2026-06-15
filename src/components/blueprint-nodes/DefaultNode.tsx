import { Handle, Position } from '@xyflow/react';

import type { NodeData } from '@/api/blueprint-graph/blueprint-graph-types';
import type { Node, NodeProps } from '@xyflow/react';

/**
 * Fallback data payload for nodes whose API `type` has no dedicated component.
 * Intersected with `Record<string, unknown>` to satisfy React Flow's node
 * data constraint (it requires an index signature).
 */
export type DefaultNodeData = NodeData & Record<string, unknown>;

/** A React Flow node rendered by the fallback `defaultNode` type. */
export type DefaultNodeType = Node<DefaultNodeData, 'defaultNode'>;

export function DefaultNode({ data, selected }: NodeProps<DefaultNodeType>) {
  return (
    <div className={`default-node${selected ? ' is-selected' : ''}`}>
      <Handle type='target' position={Position.Left} />
      <div className='default-node__title'>{data.name}</div>
      <div className='default-node__subtitle'>{data.component_type}</div>
      <Handle type='source' position={Position.Right} />
    </div>
  );
}
