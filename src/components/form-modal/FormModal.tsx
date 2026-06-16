import { useMemo, useState } from 'react';
import { FormField } from './FormField';
import { PrefillField } from './PrefillField';
import { PrefillModal } from './PrefillModal';
import { PrefillToggle } from './PrefillToggle';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  selectFormDataByNodeId,
  setFormData,
} from '@/features/form/form-slice';
import { closeModal, openSubModal } from '@/features/modal/modal-slice';
import {
  clearNodePrefillMappings,
  selectPrefillMappingsByNodeId,
} from '@/features/prefill/prefill-slice';
import { getScopeKey } from '@/utils/resolve-scope';
import { Button, Form, Modal } from 'antd';

import type { FormNodeType } from '../blueprint-nodes/FormNode';
import type { BlueprintGraph } from '@/api/blueprint-graph/blueprint-graph-types';

type FormModalProps = {
  graph: BlueprintGraph;
  node: FormNodeType;
};

export function FormModal({ graph, node }: FormModalProps) {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();

  const nodeDataId = node.data.id;
  const nodeId = node.id;

  const savedFormData = useAppSelector(selectFormDataByNodeId(nodeDataId));
  const prefillMappings = useAppSelector(selectPrefillMappingsByNodeId(nodeId));

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

  /** Commit the local form values to the global store, then close. */
  function handleSubmit(values: Record<string, unknown>) {
    dispatch(setFormData({ nodeId, data: values }));
    dispatch(closeModal());
  }

  /** Toggle prefill; clear this node's mappings when turning it off. */
  function handlePrefillToggle(enabled: boolean) {
    setIsPrefillEnabled(enabled);
    if (!enabled) dispatch(clearNodePrefillMappings({ nodeId }));
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
          <Button type='primary' onClick={() => form.submit()}>
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
              />
            ))}
          </div>
        ) : (
          <Form
            form={form}
            layout='vertical'
            initialValues={savedFormData}
            onFinish={handleSubmit}
          >
            {uiSchemaElements.map((element) => (
              <FormField
                key={element.scope}
                element={element}
                fieldSchema={formDefinition.field_schema}
              />
            ))}
          </Form>
        )}
      </div>
    </Modal>
  );
}
