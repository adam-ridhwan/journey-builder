import { useMemo } from 'react';
import { FormField } from './FormField';
import { useAppDispatch } from '@/app/hooks';
import { closeModal } from '@/features/modal/modal-slice';
import { getScopeKey } from '@/utils/resolve-scope';
import { Button, Modal } from 'antd';

import type { FormNodeType } from '../blueprint-nodes/FormNode';
import type { FormDefinition } from '@/api/blueprint-graph/blueprint-graph-types';

type FormModalProps = {
  forms: FormDefinition[];
  node: FormNodeType;
};

export function FormModal({ forms, node }: FormModalProps) {
  const dispatch = useAppDispatch();

  const formDefinition = useMemo(
    () => forms.find((f) => f.id === node.data.component_id),
    [forms, node]
  );
  if (!formDefinition) throw new Error('Form definition not found');

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
      <div className='form-field__container'>
        {formDefinition.ui_schema.elements.map((element, i) => {
          const scopeKey = getScopeKey(element.scope);
          const fieldSchmaProperty =
            formDefinition.field_schema.properties[scopeKey];
          return (
            <FormField
              key={i}
              element={element}
              fieldSchemaProperty={fieldSchmaProperty}
            />
          );
        })}
      </div>
    </Modal>
  );
}
