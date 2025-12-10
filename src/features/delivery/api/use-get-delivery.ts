import { useQuery } from '@tanstack/react-query';

import { client } from '@/lib/hono';
import { AppDelivery } from '../type';

interface UseGetDeliveryProps {
  deliveryId: string | null;
}

export const useGetDelivery = ({ deliveryId }: UseGetDeliveryProps) => {
  const query = useQuery({
    enabled: !!deliveryId,
    queryKey: ['delivery', deliveryId],
    queryFn: async () => {
      const response = await client.api.deliveries[':deliveryId'].$get({
        param: { deliveryId: deliveryId! },
      });

      if (!response.ok) return null;

      const { data } = await response.json();
      return (data as AppDelivery) ?? null;
    },
  });

  return query;
};
