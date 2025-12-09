'use client';

import { PlusCircle } from 'lucide-react';
import { useMemo, useState } from 'react';

import { DottedSeparator } from '@/components/dotted-separator';
import { ResponsiveModal } from '@/components/responsive-modal';
import { Button } from '@/components/ui/button';
import { CustomerForm } from '@/features/customer/components/customer-form';
import { CustomerSearch } from '@/features/customer/components/customer-search';
import { CustomerTable } from '@/features/customer/components/customer-table';
import { useCreateCustomer } from '@/features/customer/api/use-create-customer';
import { useDeleteCustomer } from '@/features/customer/api/use-delete-customer';
import { useGetCustomers } from '@/features/customer/api/use-get-customers';
import { useUpdateCustomer } from '@/features/customer/api/use-update-customer';
import { useCustomerFilters } from '@/features/customer/hooks/customer-filters';
import type { CustomerFormValues } from '@/features/customer/schema';
import type { AppCustomer } from '@/features/customer/type';
import { useConfirm } from '@/hooks/use-confirm';

export const CustomerView = () => {
  const [{ search }] = useCustomerFilters();
  const { data: customers = [], isLoading } = useGetCustomers({ search });
  const { mutate: createCustomer, isPending: isCreating } = useCreateCustomer();
  const { mutate: updateCustomer, isPending: isUpdating } = useUpdateCustomer();
  const { mutate: deleteCustomer, isPending: isDeleting } = useDeleteCustomer();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<AppCustomer | null>(null);
  const [ConfirmDialog, confirmDelete] = useConfirm(
    'Delete customer',
    'This action will permanently remove the customer record.',
    'destructive',
  );

  const isSubmitting = useMemo(() => isCreating || isUpdating, [isCreating, isUpdating]);

  const handleSubmit = (values: CustomerFormValues) => {
    if (editingCustomer) {
      updateCustomer(
        { param: { customerId: editingCustomer.id }, json: values },
        { onSuccess: () => closeModal() },
      );
    } else {
      createCustomer(
        { json: values },
        { onSuccess: () => closeModal() },
      );
    }
  };

  const handleDelete = async (customer: AppCustomer) => {
    const ok = await confirmDelete();
    if (!ok) return;

    deleteCustomer({ param: { customerId: customer.id } });
  };

  const handleEdit = (customer: AppCustomer) => {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingCustomer(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingCustomer(null);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4">
      <ConfirmDialog />

      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-semibold">Customers</h1>
          <p className="text-sm text-muted-foreground">
            Manage customer profiles, billing balances, and delivery preferences.
          </p>
        </div>

        <Button onClick={handleCreate} className="w-full md:w-auto">
          <PlusCircle className="mr-2 size-4" />
          Add customer
        </Button>
      </div>

      <DottedSeparator />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <CustomerSearch />
      </div>

      <CustomerTable
        customers={customers as any}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        disableActions={isDeleting || isSubmitting}
      />

      <ResponsiveModal
        title={editingCustomer ? 'Edit customer' : 'Add customer'}
        description={
          editingCustomer
            ? 'Update contact and delivery preferences.'
            : 'Create a new customer record.'
        }
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) setEditingCustomer(null);
        }}
      >
        <CustomerForm
          initialValues={editingCustomer ?? undefined}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          onCancel={closeModal}
          submitLabel={editingCustomer ? 'Update customer' : 'Create customer'}
        />
      </ResponsiveModal>
    </div>
  );
};
