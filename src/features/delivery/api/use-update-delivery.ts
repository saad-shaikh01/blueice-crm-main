import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

import { client } from '@/lib/hono';

type ResponseType = InferResponseType<(typeof client.api.deliveries)[':deliveryId']['$patch']>;
type RequestType = InferRequestType<(typeof client.api.deliveries)[':deliveryId']['$patch']>;

export const useUpdateDelivery = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param, json }) => {
      const response = await client.api.deliveries[':deliveryId']['$patch']({ param, json });
      const result = await response.json();

      if (!response.ok) {
        const message = typeof result === 'object' && result && 'error' in result ? (result as any).error : 'Failed to update delivery';
        throw new Error(message);
      }

      return result;
    },
    onSuccess: () => {
      toast.success('Delivery updated');
      queryClient.invalidateQueries({ queryKey: ['deliveries'] });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update delivery');
    },
  });

  return mutation;
};
