import { parseAsString, useQueryStates } from 'nuqs';

export const useCustomerFilters = () => {
  return useQueryStates({
    search: parseAsString,
  });
};
