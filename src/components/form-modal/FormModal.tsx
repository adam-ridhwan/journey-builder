import { useMemo, useState } from 'react';
import { FormField } from './FormField';
import { PrefillField } from './PrefillField';
import { PrefillModal } from './PrefillModal';
import { PrefillToggle } from './PrefillToggle';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  clearFormData,
  selectFormData,
  selectFormDataByNodeId,
  setFormData,
} from '@/features/form/form-slice';
import { closeModal, openSubModal } from '@/features/modal/modal-slice';
import {
  clearNodePrefillMappings,
  clearPrefillMapping,
  selectPrefillMappingsByNodeId,
} from '@/features/prefill/prefill-slice';
import { resolvePrefillValue } from '@/utils/resolve-prefill-value';
import { getScopeKey } from '@/utils/resolve-scope';
import { Button, Modal } from 'antd';

import type { FormNodeType } from '../blueprint-nodes/FormNode';
import type { BlueprintGraph } from '@/api/blueprint-graph/blueprint-graph-types';

type FormModalProps = {
  graph: BlueprintGraph;
  node: FormNodeType;
};

export function FormModal({ graph, node }: FormModalProps) {
  const dispatch = useAppDispatch();
  const nodeId = node.id;

  const savedFormData = useAppSelector(selectFormDataByNodeId(nodeId));
  const prefillMappings = useAppSelector(selectPrefillMappingsByNodeId(nodeId));
  const allFormData = useAppSelector(selectFormData);

  // Local, controlled form values seeded from whatever was last committed.
  const [values, setValues] = useState<Record<string, unknown>>(
    () => savedFormData ?? {}
  );

  const hasPrefillMappings = Boolean(
    prefillMappings && Object.keys(prefillMappings).length > 0
  );
  // Default the toggle on when this node already has mappings; user can still flip it.
  const [isPrefillEnabled, setIsPrefillEnabled] = useState(hasPrefillMappings);

  const formDefinition = useMemo(
    () => graph.forms.find((f) => f.id === node.data.component_id),
    [graph, node]
  );
  if (!formDefinition) throw new Error('Form definition not found');

  function handleChange(fieldKey: string, value: unknown) {
    setValues((prev) => ({ ...prev, [fieldKey]: value }));
  }

  /** Commit local values, overriding mapped fields with their prefilled values. */
  function handleSubmit() {
    const data = { ...values };
    for (const [fieldKey, source] of Object.entries(prefillMappings ?? {})) {
      data[fieldKey] = resolvePrefillValue(source, { formData: allFormData });
    }
    dispatch(setFormData({ nodeId, data }));
    dispatch(closeModal());
  }

  /**
   * Toggle prefill. Turning it off clears this node's mappings; turning it on
   * clears the node's manually-entered form data (it'll be filled from sources).
   */
  function handlePrefillToggle(enabled: boolean) {
    setIsPrefillEnabled(enabled);

    if (enabled) {
      dispatch(clearFormData({ nodeId }));
      setValues({});
    } else {
      dispatch(clearNodePrefillMappings({ nodeId }));
    }
  }

  const uiSchemaElements = formDefinition.ui_schema?.elements ?? [];

  return (
    <Modal
      centered
      open
      title={node.data.name}
      onCancel={() => dispatch(closeModal())}
      footer={
        <>
          <Button onClick={() => dispatch(closeModal())}>Cancel</Button>
          <Button type='primary' onClick={handleSubmit}>
            Submit
          </Button>
        </>
      }
    >
      <div className='form-modal__content'>
        <PrefillToggle
          isEnabled={isPrefillEnabled}
          onChange={handlePrefillToggle}
        />

        {isPrefillEnabled ? (
          <div className='prefill-list'>
            {uiSchemaElements.map((element) => (
              <PrefillField
                key={element.scope}
                element={element}
                source={prefillMappings?.[getScopeKey(element.scope)]?.label}
                onSelect={() =>
                  dispatch(
                    openSubModal(
                      <PrefillModal
                        graph={graph}
                        node={node}
                        targetFieldKey={getScopeKey(element.scope)}
                      />
                    )
                  )
                }
                onClear={() =>
                  dispatch(
                    clearPrefillMapping({
                      nodeId,
                      fieldKey: getScopeKey(element.scope),
                    })
                  )
                }
              />
            ))}
          </div>
        ) : (
          <div className='form-fields'>
            {uiSchemaElements.map((element) => {
              const fieldKey = getScopeKey(element.scope);
              return (
                <FormField
                  key={element.scope}
                  element={element}
                  fieldSchema={formDefinition.field_schema}
                  value={values[fieldKey]}
                  onChange={(value) => handleChange(fieldKey, value)}
                />
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
}
