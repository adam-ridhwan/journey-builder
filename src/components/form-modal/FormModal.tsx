import { useMemo } from 'react';
import { FormField } from './FormField';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { selectFormDataByNodeId } from '@/features/form/form-slice';
import { closeModal } from '@/features/modal/modal-slice';
import { getScopeKey } from '@/utils/resolve-scope';
import { Button, Form, Modal } from 'antd';

import type { FormNodeType } from '../blueprint-nodes/FormNode';
import type { FormDefinition } from '@/api/blueprint-graph/blueprint-graph-types';

type FormModalProps = {
  forms: FormDefinition[];
  node: FormNodeType;
};

export function FormModal({ forms, node }: FormModalProps) {
  const dispatch = useAppDispatch();

  const formDataByNodeId = useAppSelector(selectFormDataByNodeId(node.data.id));
  console.log('formDataByNodeId', formDataByNodeId);

  const formDefinition = useMemo(
    () => forms.find((f) => f.id === node.data.component_id),
    [forms, node]
  );
  if (!formDefinition) throw new Error('Form definition not found');

  const elements = formDefinition.ui_schema?.elements ?? [];

  return (
    <Modal
      centered
      open
      title={node.data.name}
      onCancel={() => dispatch(closeModal())}
      footer={
        <>
          <Button onClick={() => dispatch(closeModal())}>Cancel</Button>
          <Button type='primary'>Submit</Button>
        </>
      }
    >
      <Form layout='vertical' className='form-field__container'>
        {elements.map((element, i) => {
          const scopeKey = getScopeKey(element.scope);
          const fieldSchmaProperty =
            formDefinition.field_schema.properties[scopeKey];
          const isRequired =
            formDefinition.field_schema.required?.includes(scopeKey) ?? false;

          return (
            <FormField
              key={i}
              nodeId={node.data.id}
              name={scopeKey}
              element={element}
              fieldSchemaProperty={fieldSchmaProperty}
              isRequired={isRequired}
            />
          );
        })}
      </Form>
    </Modal>
  );
}
