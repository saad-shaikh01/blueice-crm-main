import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/hono';

export const useGetInvoices = () => {
  const query = useQuery({
    queryKey: ['invoices'],
    queryFn: async () => {
      const response = await client.api.invoices.$get();

      if (!response.ok) return [];

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
