import { useQuery } from '@tanstack/react-query';

import { client } from '@/lib/hono';
import type { AppProduct } from '@/features/product/type';

interface UseGetProductsProps {
  search?: string | null;
}

export const useGetProducts = ({ search }: UseGetProductsProps) => {
  const query = useQuery<AppProduct[]>({
    queryKey: ['products', search],
    queryFn: async () => {
      const response = await client.api.products.$get({
        query: {
          search: search ?? undefined,
        },
      });

      if (!response.ok) return [];

      const { data } = await response.json();
      return data ?? [];
    },
  });

  return query;
};
