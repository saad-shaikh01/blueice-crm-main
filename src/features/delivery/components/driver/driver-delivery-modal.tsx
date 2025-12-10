'use client';

import { useMemo } from 'react';

import { ResponsiveModal } from '@/components/responsive-modal';
import { DeliveryForm } from '@/features/delivery/components/delivery-form';
import { useUpdateDelivery } from '@/features/delivery/api/use-update-delivery';
import type { DeliveryFormValues } from '@/features/delivery/schema';
import { useEditDeliveryModal } from '@/features/delivery/hooks/use-edit-delivery-modal';
import { useGetDelivery } from '@/features/delivery/api/use-get-delivery';

export const DriverDeliveryModal = () => {
  const { deliveryId, close } = useEditDeliveryModal();
  const { data: delivery, isLoading: isLoadingDelivery } = useGetDelivery({ deliveryId });
  const { mutate: updateDelivery, isPending: isUpdating } = useUpdateDelivery();

  const isSubmitting = useMemo(() => isUpdating, [isUpdating]);

  const handleSubmit = (values: DeliveryFormValues) => {
    if (!deliveryId) return;

    // For driver, we might want to use a specific 'complete' endpoint or just update.
    // The current form updates the whole delivery object.
    // We can just use updateDelivery for now, but ensure status is set to DELIVERED if not already.

    // Check if we need to force status to DELIVERED?
    // The form allows changing status.

    updateDelivery(
      { param: { deliveryId }, json: values },
      { onSuccess: () => close() },
    );
  };

  if (!deliveryId) return null;

  return (
    <ResponsiveModal
      title="Complete Delivery"
      description="Update bottles delivered, returned, and payment received."
      open={!!deliveryId}
      onOpenChange={(open) => {
        if (!open) close();
      }}
    >
        {isLoadingDelivery || !delivery ? (
             <div className="p-4 text-center">Loading delivery details...</div>
        ) : (
            <DeliveryForm
                initialValues={{
                    ...delivery,
                    date: new Date(delivery.date),
                    scheduledDate: delivery.scheduledDate ? new Date(delivery.scheduledDate) : undefined,
                    actualDate: delivery.actualDate ? new Date(delivery.actualDate) : new Date(), // Default to now if not set
                    code: delivery.code ?? undefined,
                    ticketNumber: delivery.ticketNumber ?? undefined,
                    rate: delivery.rate ?? undefined,
                    paymentType: (delivery.paymentType as 'cash' | 'online' | 'card' | null) ?? undefined,
                    previousMonthAmount: delivery.previousMonthAmount ?? 0,
                    currentMonthPaid: delivery.currentMonthPaid ?? 0,
                    previousOutstanding: delivery.previousOutstanding ?? 0,
                    currentOutstanding: delivery.currentOutstanding ?? 0,
                    previousBalance: delivery.previousBalance ?? 0,
                    currentBalance: delivery.currentBalance ?? 0,
                    previousBottleBalance: delivery.previousBottleBalance ?? 0,
                    currentBottleBalance: delivery.currentBottleBalance ?? 0,
                    amountDue: delivery.amountDue ?? 0,
                    amountReceived: delivery.amountReceived ?? 0,
                    notes: delivery.notes ?? undefined,
                    entries: delivery.entries.map((entry) => ({
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
                    customerId: delivery.customerId,
                    deliveryPerson: delivery.deliveryPerson ?? undefined,
                    status: delivery.status === 'PENDING' || delivery.status === 'SCHEDULED' ? 'DELIVERED' : delivery.status,
                }}
                isSubmitting={isSubmitting}
                onSubmit={handleSubmit}
                onCancel={close}
                submitLabel="Complete Delivery"
            />
        )}
    </ResponsiveModal>
  );
};
