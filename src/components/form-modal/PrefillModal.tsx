import { useAppDispatch } from '@/app/hooks';
import { closeSubModal } from '@/features/modal/modal-slice';
import { setPrefillMapping } from '@/features/prefill/prefill-slice';
import { getUpstreamNodes } from '@/utils/get-upstream-nodes';
import { Modal, Tag } from 'antd';

import type { FormNodeType } from '../blueprint-nodes/FormNode';
import type { BlueprintGraph } from '@/api/blueprint-graph/blueprint-graph-types';

type PrefillModalProps = {
  graph: BlueprintGraph;
  node: FormNodeType;
  /** The field on `node` that this mapping will fill. */
  targetFieldKey: string;
};

/** Source-selector modal: pick an upstream form field to prefill from. */
export function PrefillModal({ graph, node, targetFieldKey }: PrefillModalProps) {
  const dispatch = useAppDispatch();

  const upstreamNodes = getUpstreamNodes(graph, node.id);

  return (
    <Modal
      centered
      open
      title='Select data element to map'
      footer={null}
      onCancel={() => dispatch(closeSubModal())}
    >
      <div className='prefill-sources'>
        {upstreamNodes.map(({ node: upstream, dependency }) => {
          const form = graph.forms.find(
            (f) => f.id === upstream.data.component_id
          );
          const fieldKeys = Object.keys(form?.field_schema.properties ?? {});

          return (
            <div className='prefill-source' key={upstream.id}>
              <div className='prefill-source__header'>
                <span className='prefill-source__title'>
                  {upstream.data.name}
                </span>
                <Tag color={dependency === 'direct' ? 'blue' : 'geekblue'}>
                  {dependency}
                </Tag>
              </div>

              <div className='prefill-source__fields'>
                {fieldKeys.map((fieldKey) => (
                  <button
                    type='button'
                    key={fieldKey}
                    className='prefill-source__field'
                    onClick={() => {
                      dispatch(
                        setPrefillMapping({
                          nodeId: node.id,
                          fieldKey: targetFieldKey,
                          source: {
                            type: 'form-field',
                            label: `${upstream.data.name}.${fieldKey}`,
                            sourceNodeId: upstream.id,
                            sourceFieldKey: fieldKey,
                          },
                        })
                      );
                      dispatch(closeSubModal());
                    }}
                  >
                    {fieldKey}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
}
