import { useCallback, useEffect } from 'react';
import { nodeTypes } from '../blueprint-nodes/node-types';
import { FormModal } from '../form-modal/FormModal';
import { createEdges } from './create-edges';
import { createNodes } from './create-nodes';
import { useGetBlueprintGraphQuery } from '@/api/blueprint-graph/blueprint-graph-api';
import { useAppDispatch } from '@/app/hooks';
import { openModal } from '@/features/modal/modal-slice';
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';
import { Button, Result, Spin } from 'antd';

import type { AppNode } from '../blueprint-nodes/node-types';
import type { Edge } from '@xyflow/react';

import '@xyflow/react/dist/style.css';

export function BlueprintFlow() {
  const dispatch = useAppDispatch();

  const {
    data: graph,
    isLoading,
    isError,
    refetch,
  } = useGetBlueprintGraphQuery();

  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  useEffect(() => {
    if (!graph) return;
    setNodes(createNodes(graph));
    setEdges(createEdges(graph));
  }, [graph, setNodes, setEdges]);

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: AppNode) => {
      if (!graph) return;

      switch (node.type) {
        case 'formNode':
          dispatch(openModal(<FormModal graph={graph} node={node} />));
          break;

        default:
        // no-op
      }
    },
    [dispatch, graph]
  );

  if (isLoading) {
    return (
      <div className='flow-state'>
        <Spin size='large' tip='Loading blueprint…'>
          <div style={{ padding: 24 }} />
        </Spin>
      </div>
    );
  }

  if (isError || !graph) {
    return (
      <div className='flow-state'>
        <Result
          status='error'
          title='Failed to load the blueprint graph'
          subTitle='Check that the mock server is running and reachable.'
          extra={
            <Button type='primary' onClick={() => refetch()}>
              Retry
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeClick={onNodeClick}
      fitView
    >
      <Background />
      <Controls />
      <MiniMap />
    </ReactFlow>
  );
}
