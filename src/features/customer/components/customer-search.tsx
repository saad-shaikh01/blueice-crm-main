'use client';

import { SearchIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Input } from '@/components/ui/input';
import { useCustomerFilters } from '@/features/customer/hooks/customer-filters';
import { useDebounce } from '@/hooks/use-debounce';

export const CustomerSearch = () => {
  const [{ search }, setFilters] = useCustomerFilters();
  const [value, setValue] = useState(search ?? '');
  const debouncedValue = useDebounce(value);

  useEffect(() => {
    setValue(search ?? '');
  }, [search]);

  useEffect(() => {
    setFilters({
      search: debouncedValue.trim().length > 0 ? debouncedValue : null,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  return (
    <div className="relative w-full max-w-md">
      <SearchIcon className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
      <Input
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search customers..."
        className="pl-8"
      />
    </div>
  );
};
