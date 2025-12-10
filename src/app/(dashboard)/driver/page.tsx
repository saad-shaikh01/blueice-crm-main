'use client';

import { useGetDeliveries } from '@/features/delivery/api/use-get-deliveries';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { useEditDeliveryModal } from '@/features/delivery/hooks/use-edit-delivery-modal';
import { DriverDeliveryModal } from '@/features/delivery/components/driver/driver-delivery-modal';

export default function DriverPage() {
  const { open } = useEditDeliveryModal();

  // Use today as default range
  const { data: deliveries, isLoading } = useGetDeliveries({
    range: 'today',
    assignedToMe: true,
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const pendingDeliveries = deliveries?.filter(d => d.status === 'SCHEDULED' || d.status === 'PENDING') || [];
  const completedDeliveries = deliveries?.filter(d => d.status === 'DELIVERED') || [];

  return (
    <div className="flex flex-col gap-4 p-4 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Route</h1>
        <div className="text-sm text-muted-foreground">
          {format(new Date(), 'MMM dd, yyyy')}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Pending ({pendingDeliveries.length})</h2>
        {pendingDeliveries.length === 0 ? (
          <p className="text-sm text-muted-foreground">No pending deliveries for today.</p>
        ) : (
          pendingDeliveries.map((delivery) => (
            <Card key={delivery.id} className="cursor-pointer hover:bg-accent/50" onClick={() => open(delivery.id)}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">{delivery.customer.name}</h3>
                    <p className="text-sm text-muted-foreground">{delivery.customer.address}</p>
                    <div className="mt-2 text-sm">
                      <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs">
                        {delivery.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <Button size="sm" onClick={(e) => {
                      e.stopPropagation();
                      open(delivery.id);
                    }}>
                      Action
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Completed ({completedDeliveries.length})</h2>
        {completedDeliveries.map((delivery) => (
            <Card key={delivery.id} className="opacity-75">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold">{delivery.customer.name}</h3>
                    <p className="text-sm text-muted-foreground">{delivery.customer.address}</p>
                  </div>
                  <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs">
                    Completed
                  </span>
                </div>
              </CardContent>
            </Card>
        ))}
      </div>

      <DriverDeliveryModal />
    </div>
  );
}
