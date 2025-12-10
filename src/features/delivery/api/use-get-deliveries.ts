import { useQuery } from '@tanstack/react-query';

import { client } from '@/lib/hono';
import type { AppDelivery } from '@/features/delivery/type';

interface UseGetDeliveriesProps {
  search?: string | null;
  status?: 'PENDING' | 'SCHEDULED' | 'DELIVERED' | 'SKIPPED' | 'CANCELLED' | null;
  range?: 'today' | 'tomorrow' | 'week' | null;
  date?: string | null;
  assignedToMe?: boolean;
}

export const useGetDeliveries = ({ search, status, range, date, assignedToMe }: UseGetDeliveriesProps) => {
  const query = useQuery<AppDelivery[]>({
    queryKey: ['deliveries', search, status, range, date, assignedToMe],
    queryFn: async () => {
      const response = await client.api.deliveries.$get({
        query: {
          search: search ?? undefined,
          status: status ?? undefined as any,
          range: range ?? undefined as any,
          date: date ?? undefined,
          assignedToMe: assignedToMe ? 'true' : undefined,
        },
      });

      if (!response.ok) return [];

      const { data } = await response.json();
      return (data as AppDelivery[] | undefined) ?? [];
    },
  });

  return query;
};
