import { useAppSelector } from '@/app/hooks';

export default function ModalRoot() {
  const { isOpen, children, subModal } = useAppSelector((state) => state.modal);

  return (
    <>
      {isOpen && children}
      {subModal.isOpen && subModal.children}
    </>
  );
}
