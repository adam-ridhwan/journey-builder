import { useMemo, useState } from 'react';
import { FormField } from './FormField';
import { PrefillToggle } from './PrefillToggle';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  selectFormDataByNodeId,
  setFormData,
} from '@/features/form/form-slice';
import { closeModal } from '@/features/modal/modal-slice';
import { Button, Form, Modal } from 'antd';

import type { FormNodeType } from '../blueprint-nodes/FormNode';
import type { FormDefinition } from '@/api/blueprint-graph/blueprint-graph-types';

type FormModalProps = {
  forms: FormDefinition[];
  node: FormNodeType;
};

export function FormModal({ forms, node }: FormModalProps) {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();

  const nodeId = node.data.id;
  // Prefill the form with whatever was last committed for this node.
  const savedFormData = useAppSelector(selectFormDataByNodeId(nodeId));

  const [isPrefillEnabled, setIsPrefillEnabled] = useState(false);

  const formDefinition = useMemo(
    () => forms.find((f) => f.id === node.data.component_id),
    [forms, node]
  );
  if (!formDefinition) throw new Error('Form definition not found');

  /** Commit the local form values to the global store, then close. */
  function handleSubmit(values: Record<string, unknown>) {
    dispatch(setFormData({ nodeId, data: values }));
    dispatch(closeModal());
  }

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
          onChange={setIsPrefillEnabled}
        />

        <Form
          form={form}
          layout='vertical'
          initialValues={savedFormData}
          onFinish={handleSubmit}
        >
          {(formDefinition.ui_schema?.elements ?? []).map((element, i) => (
            <FormField
              key={i}
              element={element}
              fieldSchema={formDefinition.field_schema}
            />
          ))}
        </Form>
      </div>
    </Modal>
  );
}
