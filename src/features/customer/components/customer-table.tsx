'use client';

import { Loader2, Pencil, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AppCustomer } from '@/features/customer/type';

interface CustomerTableProps {
  customers: AppCustomer[];
  isLoading?: boolean;
  onEdit: (customer: AppCustomer) => void;
  onDelete: (customer: AppCustomer) => void;
  disableActions?: boolean;
}

const currency = new Intl.NumberFormat(undefined, {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});

export const CustomerTable = ({ customers, isLoading, onEdit, onDelete, disableActions }: CustomerTableProps) => {
  if (isLoading) {
    return (
      <div className="flex h-[240px] w-full items-center justify-center rounded-md border">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!customers.length) {
    return (
      <div className="flex h-[240px] w-full items-center justify-center rounded-md border text-sm text-muted-foreground">
        No customers found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Pricing plan</TableHead>
            <TableHead>Schedule</TableHead>
            <TableHead className="text-right">Balance</TableHead>
            <TableHead className="text-right">Empty bottles</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell className="font-medium">{customer.name}</TableCell>
              <TableCell>{customer.email}</TableCell>
              <TableCell>{customer.phoneNumber}</TableCell>
              <TableCell>{customer.pricingPlan}</TableCell>
              <TableCell>{customer.deliverySchedule}</TableCell>
              <TableCell className="text-right">{currency.format(customer.balance ?? 0)}</TableCell>
              <TableCell className="text-right">{customer.emptyBottles ?? 0}</TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(customer)}
                    disabled={disableActions}
                    className="text-muted-foreground"
                  >
                    <Pencil className="mr-1 size-4" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(customer)}
                    disabled={disableActions}
                    className="text-destructive"
                  >
                    <Trash2 className="mr-1 size-4" />
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
