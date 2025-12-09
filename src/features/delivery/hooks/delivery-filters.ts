import { parseAsString, useQueryStates } from 'nuqs';

export const useDeliveryFilters = () => {
  return useQueryStates({
    search: parseAsString,
    date: parseAsString,
    status: parseAsString,
    range: parseAsString,
  });
};
