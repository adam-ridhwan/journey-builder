import { useEffect } from 'react';
import { nodeTypes } from '../blueprint-nodes/node-types';
import { createEdges } from './create-edges';
import { createNodes } from './create-nodes';
import { useGetBlueprintGraphQuery } from '@/api/blueprint-graph/blueprint-graph-api';
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';

import type { AppNode } from '../blueprint-nodes/node-types';
import type { Edge } from '@xyflow/react';

import '@xyflow/react/dist/style.css';

export function BlueprintFlow() {
  const { data: graph } = useGetBlueprintGraphQuery();

  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  useEffect(() => {
    if (!graph) return;
    setNodes(createNodes(graph));
    setEdges(createEdges(graph));
  }, [graph, setNodes, setEdges]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      fitView
    >
      <Background />
      <Controls />
      <MiniMap />
    </ReactFlow>
  );
}
