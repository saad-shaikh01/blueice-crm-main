import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

import { client } from '@/lib/hono';

type ResponseType = InferResponseType<(typeof client.api.customers)[':customerId']['$delete']>;
type RequestType = InferRequestType<(typeof client.api.customers)[':customerId']['$delete']>;

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.customers[':customerId']['$delete']({ param });
      const result = await response.json();

      if (!response.ok) {
        const message = typeof result === 'object' && result && 'error' in result ? (result as any).error : 'Failed to delete customer';
        throw new Error(message);
      }

      return result;
    },
    onSuccess: () => {
      toast.success('Customer deleted');
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete customer');
    },
  });

  return mutation;
};
