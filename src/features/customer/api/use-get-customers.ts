import { useQuery } from '@tanstack/react-query';

import { client } from '@/lib/hono';
import type { AppCustomer } from '@/features/customer/type';

interface UseGetCustomersProps {
  search?: string | null;
}

export const useGetCustomers = ({ search }: UseGetCustomersProps) => {
  const query = useQuery<AppCustomer[]>({
    queryKey: ['customers', search],
    queryFn: async () => {
      const response = await client.api.customers.$get({
        query: {
          search: search ?? undefined,
        },
      });

      if (!response.ok) return [];

      const { data } = await response.json();
      return (data as AppCustomer[] | undefined) ?? [];
    },
  });

  return query;
};
