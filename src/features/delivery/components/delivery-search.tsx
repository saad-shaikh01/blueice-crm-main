'use client';

import { CalendarIcon, SearchIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDeliveryFilters } from '@/features/delivery/hooks/delivery-filters';
import { useDebounce } from '@/hooks/use-debounce';

export const DeliverySearch = () => {
  const [{ search, date, status, range }, setFilters] = useDeliveryFilters();
  const [value, setValue] = useState(search ?? '');
  const [dateValue, setDateValue] = useState(date ?? '');
  const [statusValue, setStatusValue] = useState(status ?? '');
  const [rangeValue, setRangeValue] = useState(range ?? 'today');
  const debouncedValue = useDebounce(value);

  useEffect(() => {
    setValue(search ?? '');
    setDateValue(date ?? '');
    setStatusValue(status ?? '');
    setRangeValue(range ?? 'today');
  }, [search, date, status, range]);

  useEffect(() => {
    setFilters({
      search: debouncedValue.trim().length > 0 ? debouncedValue : null,
      date: dateValue || null,
      status: statusValue || null,
      range: rangeValue || 'today',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue, dateValue, statusValue, rangeValue]);

  return (
    <div className="flex w-full flex-col gap-2 md:flex-row md:items-center md:gap-3">
      <div className="relative w-full max-w-md">
        <SearchIcon className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
        <Input
          type="search"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Search deliveries by ticket, code, or customer"
          className="pl-8"
        />
      </div>
      <div className="relative w-full max-w-xs">
        <CalendarIcon className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
        <Input
          type="date"
          value={dateValue}
          onChange={(event) => setDateValue(event.target.value)}
          className="pl-8"
        />
      </div>
      <div className="w-full max-w-xs">
        <Select value={statusValue || ''} onValueChange={(val) => setStatusValue(val)}>
          <SelectTrigger>
            <SelectValue placeholder="Status (due)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Due (Pending + Scheduled)</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="SCHEDULED">Scheduled</SelectItem>
            <SelectItem value="DELIVERED">Delivered</SelectItem>
            <SelectItem value="SKIPPED">Skipped</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex w-full flex-1 flex-wrap gap-2">
        {[
          { key: 'today', label: 'Today' },
          { key: 'tomorrow', label: 'Tomorrow' },
          { key: 'week', label: 'Next 7 days' },
        ].map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setRangeValue(item.key)}
            className={`rounded-md border px-3 py-2 text-sm ${rangeValue === item.key ? 'bg-primary text-primary-foreground' : 'bg-background text-foreground'}`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};
