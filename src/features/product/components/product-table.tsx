'use client';

import { Loader2, Pencil, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { AppProduct } from '@/features/product/type';

interface ProductTableProps {
  products: AppProduct[];
  isLoading?: boolean;
  onEdit: (product: AppProduct) => void;
  onDelete: (product: AppProduct) => void;
  disableActions?: boolean;
}

const currency = new Intl.NumberFormat(undefined, {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});

export const ProductTable = ({ products, isLoading, onEdit, onDelete, disableActions }: ProductTableProps) => {
  if (isLoading) {
    return (
      <div className="flex h-[240px] w-full items-center justify-center rounded-md border">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="flex h-[240px] w-full items-center justify-center rounded-md border text-sm text-muted-foreground">
        No products found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Quantity</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell className="max-w-sm truncate">{product.description}</TableCell>
              <TableCell className="text-right">{currency.format(product.price ?? 0)}</TableCell>
              <TableCell className="text-right">{product.quantity ?? 0}</TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(product)}
                    disabled={disableActions}
                    className="text-muted-foreground"
                  >
                    <Pencil className="mr-1 size-4" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(product)}
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
