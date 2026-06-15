import type { BlueprintGraph } from '@/api/blueprint-graph/blueprint-graph-types';
import type { Edge } from '@xyflow/react';

/** Map API edges (source = prerequisite of target) to React Flow edges. */
export function createEdges(graph: BlueprintGraph): Edge[] {
  return graph.edges.map((edge) => ({
    id: `${edge.source}->${edge.target}`,
    source: edge.source,
    target: edge.target,
  }));
}
