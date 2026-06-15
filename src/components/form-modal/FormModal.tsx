import { FORM_NODE } from '../blueprint-nodes/node-types';
import { useAppDispatch } from '@/app/hooks';
import { closeModal } from '@/features/modal/modal-slice';
import { Button, Modal } from 'antd';

import type { AppNode } from '../blueprint-nodes/node-types';

type FormModalProps = {
  node: AppNode;
};

export function FormModal({ node }: FormModalProps) {
  const dispatch = useAppDispatch();
  console.log('node', node.data.name);

  if (node.type !== FORM_NODE) return null;

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
      hey
    </Modal>
  );
}
