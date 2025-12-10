import { parseAsString, useQueryState } from 'nuqs';

export const useEditDeliveryModal = () => {
  const [deliveryId, setDeliveryId] = useQueryState('edit-delivery', parseAsString);

  const open = (id: string) => setDeliveryId(id);
  const close = () => setDeliveryId(null);

  return {
    deliveryId,
    open,
    close,
    setDeliveryId,
  };
};
