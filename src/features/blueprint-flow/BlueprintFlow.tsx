import { useGetBlueprintGraphQuery } from '@/api/blueprint-graph/blueprint-graph-api';
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';

import type { Edge, Node } from '@xyflow/react';

import '@xyflow/react/dist/style.css';

export function BlueprintFlow() {
  const { data: graph, isLoading, error } = useGetBlueprintGraphQuery();

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
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
