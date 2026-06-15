import type {
  BlueprintGraph,
  GraphNode,
} from '@/api/blueprint-graph/blueprint-graph-types';

/** How a node depends on the starting node. */
export type DependencyKind = 'direct' | 'transitive';

export type UpstreamNode = {
  node: GraphNode;
  /** `direct` = an immediate prerequisite; `transitive` = further upstream. */
  dependency: DependencyKind;
};

/**
 * Walk up the DAG from `nodeId` via each node's `prerequisites` and return every
 * ancestor node. Breadth-first, so a node reachable by multiple paths is marked
 * by its shortest path: an immediate prerequisite is `direct`, anything deeper is
 * `transitive`. Cycles and duplicates are guarded against.
 *
 * The start node itself is not included.
 */
export function getUpstreamNodes(
  graph: BlueprintGraph,
  nodeId: string
): UpstreamNode[] {
  const nodesById = new Map(graph.nodes.map((n) => [n.id, n]));
  const start = nodesById.get(nodeId);
  if (!start) return [];

  const result: UpstreamNode[] = [];
  const visited = new Set<string>([nodeId]);

  let frontier = start.data.prerequisites;
  let depth = 1;

  while (frontier.length > 0) {
    const next: string[] = [];

    for (const id of frontier) {
      if (visited.has(id)) continue;
      visited.add(id);

      const node = nodesById.get(id);
      if (!node) continue;

      result.push({ node, dependency: depth === 1 ? 'direct' : 'transitive' });
      next.push(...node.data.prerequisites);
    }

    frontier = next;
    depth += 1;
  }

  return result;
}
