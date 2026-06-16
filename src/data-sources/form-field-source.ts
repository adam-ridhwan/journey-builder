import { getUpstreamNodes } from '@/utils/get-upstream-nodes';

import type { PrefillDataSource } from './types';

/**
 * Prefill from the fields of upstream forms — both forms the target directly
 * depends on (`direct`) and ones it depends on transitively (`transitive`).
 * Discovered by walking the DAG, so no data source needs to be wired up by hand.
 */
export const formFieldSource: PrefillDataSource = {
  type: 'form-field',

  getOptionGroups({ graph, node }) {
    return getUpstreamNodes(graph, node.id).map(
      ({ node: upstream, dependency }) => {
        const form = graph.forms.find(
          (f) => f.id === upstream.data.component_id
        );
        const fieldKeys = Object.keys(form?.field_schema.properties ?? {});

        return {
          id: upstream.id,
          title: upstream.data.name,
          badge: dependency,
          options: fieldKeys.map((fieldKey) => ({
            id: fieldKey,
            label: fieldKey,
            source: {
              type: 'form-field' as const,
              label: `${upstream.data.name}.${fieldKey}`,
              sourceNodeId: upstream.id,
              sourceFieldKey: fieldKey,
            },
          })),
        };
      }
    );
  },

  resolve(source, { formData }) {
    if (source.type !== 'form-field') return undefined;
    return formData[source.sourceNodeId]?.[source.sourceFieldKey];
  },
};
