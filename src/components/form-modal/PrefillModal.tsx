import { useAppDispatch } from '@/app/hooks';
import { PREFILL_DATA_SOURCES } from '@/data-sources/registry';
import { closeSubModal } from '@/features/modal/modal-slice';
import { setPrefillMapping } from '@/features/prefill/prefill-slice';
import { Modal, Tag } from 'antd';

import type { FormNodeType } from '../blueprint-nodes/FormNode';
import type { BlueprintGraph } from '@/api/blueprint-graph/blueprint-graph-types';

type PrefillModalProps = {
  graph: BlueprintGraph;
  node: FormNodeType;
  /** The field on `node` that this mapping will fill. */
  targetFieldKey: string;
};

/** Tag color per badge; unknown badges fall back to a neutral color. */
const BADGE_COLORS: Record<string, string> = {
  direct: 'blue',
  transitive: 'geekblue',
  global: 'green',
};

/**
 * Source-selector modal. Renders every group offered by the registered data
 * sources, so new sources appear here automatically with no changes to this file.
 */
export function PrefillModal({ graph, node, targetFieldKey }: PrefillModalProps) {
  const dispatch = useAppDispatch();

  return (
    <Modal
      centered
      open
      title='Select data element to map'
      footer={null}
      onCancel={() => dispatch(closeSubModal())}
    >
      <div className='prefill-sources'>
        {PREFILL_DATA_SOURCES.flatMap((dataSource) =>
          dataSource.getOptionGroups({ graph, node }).map((group) => (
            <div className='prefill-source' key={`${dataSource.type}:${group.id}`}>
              <div className='prefill-source__header'>
                <span className='prefill-source__title'>{group.title}</span>
                {group.badge && (
                  <Tag color={BADGE_COLORS[group.badge]}>{group.badge}</Tag>
                )}
              </div>

              <div className='prefill-source__fields'>
                {group.options.map((option) => (
                  <button
                    type='button'
                    key={option.id}
                    className='prefill-source__field'
                    onClick={() => {
                      dispatch(
                        setPrefillMapping({
                          nodeId: node.id,
                          fieldKey: targetFieldKey,
                          source: option.source,
                        })
                      );
                      dispatch(closeSubModal());
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </Modal>
  );
}
