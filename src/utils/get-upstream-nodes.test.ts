import { getUpstreamNodes } from './get-upstream-nodes';
import { buildGraph, diamondGraph } from '@/test/graph-fixture';
import { describe, expect, it } from 'vitest';

describe('getUpstreamNodes', () => {
  it('returns [] for an unknown node', () => {
    expect(getUpstreamNodes(diamondGraph, 'nope')).toEqual([]);
  });

  it('returns [] for a root node with no prerequisites', () => {
    expect(getUpstreamNodes(diamondGraph, 'form-a')).toEqual([]);
  });

  it('excludes the start node itself', () => {
    const ids = getUpstreamNodes(diamondGraph, 'form-d').map((u) => u.node.id);
    expect(ids).not.toContain('form-d');
  });

  it('marks immediate prerequisites as direct', () => {
    const direct = getUpstreamNodes(diamondGraph, 'form-d')
      .filter((u) => u.dependency === 'direct')
      .map((u) => u.node.id);
    expect(direct.sort()).toEqual(['form-b', 'form-c']);
  });

  it('marks deeper ancestors as transitive', () => {
    const transitive = getUpstreamNodes(diamondGraph, 'form-d')
      .filter((u) => u.dependency === 'transitive')
      .map((u) => u.node.id);
    expect(transitive).toEqual(['form-a']);
  });

  it('includes a shared ancestor only once (dedups across paths)', () => {
    const ids = getUpstreamNodes(diamondGraph, 'form-d').map((u) => u.node.id);
    expect(ids.filter((id) => id === 'form-a')).toHaveLength(1);
  });

  it('classifies by shortest path when a node is reachable directly and transitively', () => {
    // Z depends on X directly AND via Y → X. Shortest path wins → direct.
    const graph = buildGraph([
      { id: 'x', name: 'X', prerequisites: [], fields: [] },
      { id: 'y', name: 'Y', prerequisites: ['x'], fields: [] },
      { id: 'z', name: 'Z', prerequisites: ['x', 'y'], fields: [] },
    ]);
    const x = getUpstreamNodes(graph, 'z').find((u) => u.node.id === 'x');
    expect(x?.dependency).toBe('direct');
  });

  it('does not loop forever on a cycle', () => {
    const graph = buildGraph([
      { id: 'a', name: 'A', prerequisites: ['b'], fields: [] },
      { id: 'b', name: 'B', prerequisites: ['a'], fields: [] },
    ]);
    const ids = getUpstreamNodes(graph, 'a').map((u) => u.node.id);
    expect(ids).toEqual(['b']);
  });

  it('ignores prerequisite ids that are not present in the graph', () => {
    const graph = buildGraph([
      { id: 'a', name: 'A', prerequisites: ['ghost'], fields: [] },
    ]);
    expect(getUpstreamNodes(graph, 'a')).toEqual([]);
  });
});
