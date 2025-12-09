import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

import { client } from '@/lib/hono';

type ResponseType = InferResponseType<(typeof client.api.deliveries)[':deliveryId']['$delete']>;
type RequestType = InferRequestType<(typeof client.api.deliveries)[':deliveryId']['$delete']>;

export const useDeleteDelivery = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.deliveries[':deliveryId']['$delete']({ param });
      const result = await response.json();

      if (!response.ok) {
        const message = typeof result === 'object' && result && 'error' in result ? (result as any).error : 'Failed to delete delivery';
        throw new Error(message);
      }

      return result;
    },
    onSuccess: () => {
      toast.success('Delivery deleted');
      queryClient.invalidateQueries({ queryKey: ['deliveries'] });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete delivery');
    },
  });

  return mutation;
};
