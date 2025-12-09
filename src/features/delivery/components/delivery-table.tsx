'use client';

import { Loader2, Pencil, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { AppDelivery } from '@/features/delivery/type';

interface DeliveryTableProps {
  deliveries: AppDelivery[];
  isLoading?: boolean;
  onEdit: (delivery: AppDelivery) => void;
  onDelete: (delivery: AppDelivery) => void;
  disableActions?: boolean;
}

const currency = new Intl.NumberFormat(undefined, {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
});

export const DeliveryTable = ({ deliveries, isLoading, onEdit, onDelete, disableActions }: DeliveryTableProps) => {
  if (isLoading) {
    return (
      <div className="flex h-[240px] w-full items-center justify-center rounded-md border">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!deliveries.length) {
    return (
      <div className="flex h-[240px] w-full items-center justify-center rounded-md border text-sm text-muted-foreground">
        No deliveries found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Ticket</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead className="text-right">Delivered</TableHead>
            <TableHead className="text-right">Empty</TableHead>
            <TableHead className="text-right">Amount received</TableHead>
            <TableHead className="text-right">Outstanding</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {deliveries.map((delivery) => {
            const totalDelivered = delivery.entries.reduce((sum, entry) => sum + (entry.deliveredBottles ?? 0), 0);
            const totalEmpty = delivery.entries.reduce((sum, entry) => sum + (entry.emptyBottle ?? 0), 0);
            const totalReceived = delivery.entries.reduce((sum, entry) => sum + (entry.amountReceived ?? 0), 0);
            const outstanding = delivery.currentOutstanding ?? delivery.entries.at(-1)?.balanceAmount ?? 0;

            return (
              <TableRow key={delivery.id}>
                <TableCell>{new Date(delivery.date).toLocaleDateString()}</TableCell>
                <TableCell>{delivery.ticketNumber || '—'}</TableCell>
                <TableCell>{delivery.code || '—'}</TableCell>
                <TableCell className="font-medium">{delivery.customer?.name ?? '—'}</TableCell>
                <TableCell className="text-right">{totalDelivered}</TableCell>
                <TableCell className="text-right">{totalEmpty}</TableCell>
                <TableCell className="text-right">{currency.format(totalReceived)}</TableCell>
                <TableCell className="text-right">{currency.format(outstanding)}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(delivery)}
                      disabled={disableActions}
                      className="text-muted-foreground"
                    >
                      <Pencil className="mr-1 size-4" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(delivery)}
                      disabled={disableActions}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-1 size-4" />
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
