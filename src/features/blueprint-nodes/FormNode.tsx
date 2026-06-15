import { ProfileOutlined } from '@ant-design/icons';
import { getFriendlyLabel } from '@/utils/get-friendly-label';
import { Handle, Position } from '@xyflow/react';

import type { FORM_NODE } from './node-types';
import type { NodeData } from '@/api/blueprint-graph/blueprint-graph-types';
import type { Node, NodeProps } from '@xyflow/react';

/**
 * Data payload carried by a form node (the API's per-node metadata).
 * Intersected with `Record<string, unknown>` to satisfy React Flow's node
 * data constraint (it requires an index signature).
 */
export type FormNodeData = NodeData & Record<string, unknown>;

/** A React Flow node rendered by the `formNode` custom type. */
export type FormNodeType = Node<FormNodeData, typeof FORM_NODE>;

export function FormNode({ data, selected }: NodeProps<FormNodeType>) {
  return (
    <div className={`form-node${selected ? ' is-selected' : ''}`}>
      <Handle type='target' position={Position.Left} />
      <div className='form-node__icon'>
        <ProfileOutlined style={{ fontSize: 20 }} />
      </div>
      <div className='form-node__body'>
        <div className='form-node__subtitle'>
          {getFriendlyLabel(data.component_type)}
        </div>
        <div className='form-node__title'>{data.name}</div>
      </div>
      <Handle type='source' position={Position.Right} />
    </div>
  );
}
