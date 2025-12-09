import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

import { client } from '@/lib/hono';

type ResponseType = InferResponseType<(typeof client.api.products)['$post'], 201>;
type RequestType = InferRequestType<(typeof client.api.products)['$post']>;

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<any, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.products.$post({ json });
      const result = await response.json();

      if (!response.ok) {
        const message = typeof result === 'object' && result && 'error' in result ? (result as any).error : 'Failed to create product';
        throw new Error(message);
      }

      return result as any;
    },
    onSuccess: () => {
      toast.success('Product created');
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create product');
    },
  });

  return mutation;
};
