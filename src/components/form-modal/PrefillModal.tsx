import { useAppDispatch } from '@/app/hooks';
import { closeSubModal } from '@/features/modal/modal-slice';
import { Modal } from 'antd';

/** Source-selector modal for prefill mappings. (Content TBD.) */
export function PrefillModal() {
  const dispatch = useAppDispatch();

  return (
    <Modal
      centered
      open
      title='Select data element to map'
      footer={null}
      onCancel={() => dispatch(closeSubModal())}
    />
  );
}
