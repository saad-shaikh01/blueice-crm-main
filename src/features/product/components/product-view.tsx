'use client';

import { PlusCircle } from 'lucide-react';
import { useMemo, useState } from 'react';

import { DottedSeparator } from '@/components/dotted-separator';
import { ResponsiveModal } from '@/components/responsive-modal';
import { Button } from '@/components/ui/button';
import { useConfirm } from '@/hooks/use-confirm';
import { useCreateProduct } from '@/features/product/api/use-create-product';
import { useDeleteProduct } from '@/features/product/api/use-delete-product';
import { useGetProducts } from '@/features/product/api/use-get-products';
import { useUpdateProduct } from '@/features/product/api/use-update-product';
import { ProductForm } from '@/features/product/components/product-form';
import { ProductSearch } from '@/features/product/components/product-search';
import { ProductTable } from '@/features/product/components/product-table';
import { useProductFilters } from '@/features/product/hooks/product-filters';
import type { ProductFormValues } from '@/features/product/schema';
import type { AppProduct } from '@/features/product/type';

export const ProductView = () => {
  const [{ search }] = useProductFilters();
  const { data: products = [], isLoading } = useGetProducts({ search });
  const { mutate: createProduct, isPending: isCreating } = useCreateProduct();
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AppProduct | null>(null);
  const [ConfirmDialog, confirmDelete] = useConfirm(
    'Delete product',
    'This action will permanently remove the product.',
    'destructive',
  );

  const isSubmitting = useMemo(() => isCreating || isUpdating, [isCreating, isUpdating]);

  const handleSubmit = (values: ProductFormValues) => {
    if (editingProduct) {
      updateProduct(
        { param: { productId: editingProduct.id }, json: values },
        { onSuccess: () => closeModal() },
      );
    } else {
      createProduct(
        { json: values },
        { onSuccess: () => closeModal() },
      );
    }
  };

  const handleDelete = async (product: AppProduct) => {
    const ok = await confirmDelete();
    if (!ok) return;

    deleteProduct({ param: { productId: product.id } });
  };

  const handleEdit = (product: AppProduct) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingProduct(null);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4">
      <ConfirmDialog />

      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-semibold">Products</h1>
          <p className="text-sm text-muted-foreground">Manage products, pricing, and stock levels.</p>
        </div>

        <Button onClick={handleCreate} className="w-full md:w-auto">
          <PlusCircle className="mr-2 size-4" />
          Add product
        </Button>
      </div>

      <DottedSeparator />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <ProductSearch />
      </div>

      <ProductTable
        products={products}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        disableActions={isDeleting || isSubmitting}
      />

      <ResponsiveModal
        title={editingProduct ? 'Edit product' : 'Add product'}
        description={editingProduct ? 'Update price and stock levels.' : 'Create a new product.'}
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) setEditingProduct(null);
        }}
      >
        <ProductForm
          initialValues={
            editingProduct
              ? {
                  ...editingProduct,
                  description: editingProduct.description ?? undefined,
                }
              : undefined
          }
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          onCancel={closeModal}
          submitLabel={editingProduct ? 'Update product' : 'Create product'}
        />
      </ResponsiveModal>
    </div>
  );
};
