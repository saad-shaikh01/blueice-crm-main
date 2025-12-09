'use client';

import { PlusCircle } from 'lucide-react';
import { useMemo, useState } from 'react';

import { DottedSeparator } from '@/components/dotted-separator';
import { ResponsiveModal } from '@/components/responsive-modal';
import { Button } from '@/components/ui/button';
import { useConfirm } from '@/hooks/use-confirm';
import { DeliveryForm } from '@/features/delivery/components/delivery-form';
import { DeliverySearch } from '@/features/delivery/components/delivery-search';
import { DeliveryTable } from '@/features/delivery/components/delivery-table';
import { useCreateDelivery } from '@/features/delivery/api/use-create-delivery';
import { useDeleteDelivery } from '@/features/delivery/api/use-delete-delivery';
import { useGetDeliveries } from '@/features/delivery/api/use-get-deliveries';
import { useUpdateDelivery } from '@/features/delivery/api/use-update-delivery';
import { useDeliveryFilters } from '@/features/delivery/hooks/delivery-filters';
import type { DeliveryFormValues } from '@/features/delivery/schema';
import type { AppDelivery } from '@/features/delivery/type';

export const DeliveryView = () => {
  const [{ search, date, status, range }] = useDeliveryFilters();
  const { data: deliveries = [] as any, isLoading } = useGetDeliveries({
    search,
    status: status as any,
    range: range as any,
    date,
  });
  const { mutate: createDelivery, isPending: isCreating } = useCreateDelivery();
  const { mutate: updateDelivery, isPending: isUpdating } = useUpdateDelivery();
  const { mutate: deleteDelivery, isPending: isDeleting } = useDeleteDelivery();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDelivery, setEditingDelivery] = useState<AppDelivery | null>(null);
  const [ConfirmDialog, confirmDelete] = useConfirm(
    'Delete delivery',
    'This will permanently remove the delivery record.',
    'destructive',
  );

  const isSubmitting = useMemo(() => isCreating || isUpdating, [isCreating, isUpdating]);

  const handleSubmit = (values: DeliveryFormValues) => {
    if (editingDelivery) {
      updateDelivery(
        { param: { deliveryId: editingDelivery.id }, json: values },
        { onSuccess: () => closeModal() },
      );
    } else {
      createDelivery(
        { json: values },
        { onSuccess: () => closeModal() },
      );
    }
  };

  const handleDelete = async (delivery: AppDelivery) => {
    const ok = await confirmDelete();
    if (!ok) return;

    deleteDelivery({ param: { deliveryId: delivery.id } });
  };

  const handleEdit = (delivery: AppDelivery) => {
    setEditingDelivery(delivery);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingDelivery(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingDelivery(null);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4">
      <ConfirmDialog />

      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-semibold">Deliveries</h1>
          <p className="text-sm text-muted-foreground">
            Capture delivery slips with bottle counts and payment details.
          </p>
        </div>

        <Button onClick={handleCreate} className="w-full md:w-auto">
          <PlusCircle className="mr-2 size-4" />
          Add delivery
        </Button>
      </div>

      <DottedSeparator />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <DeliverySearch />
      </div>

      <DeliveryTable
        deliveries={deliveries}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        disableActions={isDeleting || isSubmitting}
      />

      <ResponsiveModal
        title={editingDelivery ? 'Edit delivery' : 'Add delivery'}
        description="Save the slip data shown on the customer copy."
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) setEditingDelivery(null);
        }}
      >
        <DeliveryForm
          initialValues={
            editingDelivery
              ? {
                  ...editingDelivery,
                  date: new Date(editingDelivery.date),
                  scheduledDate: editingDelivery.scheduledDate ? new Date(editingDelivery.scheduledDate) : undefined,
                  actualDate: editingDelivery.actualDate ? new Date(editingDelivery.actualDate) : undefined,
                  code: editingDelivery.code ?? undefined,
                  ticketNumber: editingDelivery.ticketNumber ?? undefined,
                  rate: editingDelivery.rate ?? undefined,
                  paymentType: (editingDelivery.paymentType as 'cash' | 'online' | 'card' | null) ?? undefined,
                  previousMonthAmount: editingDelivery.previousMonthAmount ?? 0,
                  currentMonthPaid: editingDelivery.currentMonthPaid ?? 0,
                  previousOutstanding: editingDelivery.previousOutstanding ?? 0,
                  currentOutstanding: editingDelivery.currentOutstanding ?? 0,
                  previousBalance: editingDelivery.previousBalance ?? 0,
                  currentBalance: editingDelivery.currentBalance ?? 0,
                  previousBottleBalance: editingDelivery.previousBottleBalance ?? 0,
                  currentBottleBalance: editingDelivery.currentBottleBalance ?? 0,
                  amountDue: editingDelivery.amountDue ?? 0,
                  amountReceived: editingDelivery.amountReceived ?? 0,
                  notes: editingDelivery.notes ?? undefined,
                  entries: editingDelivery.entries.map((entry) => ({
                    entryDate: new Date(entry.entryDate),
                    deliveredBottles: entry.deliveredBottles,
                    dropBottle: entry.dropBottle,
                    emptyBottle: entry.emptyBottle,
                    bottleBalance: entry.bottleBalance,
                    amountDue: entry.amountDue,
                    amountReceived: entry.amountReceived,
                    balanceAmount: entry.balanceAmount,
                    avBottles: entry.avBottles ?? undefined,
                    vanAmount: entry.vanAmount ?? undefined,
                  })),
                  customerId: editingDelivery.customerId,
                  deliveryPerson: editingDelivery.deliveryPerson ?? undefined,
                }
              : undefined
          }
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          onCancel={closeModal}
          submitLabel={editingDelivery ? 'Update delivery' : 'Create delivery'}
        />
      </ResponsiveModal>
    </div>
  );
};
