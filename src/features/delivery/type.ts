import type { Customer, Delivery, DeliveryEntry } from '@prisma/client';

export type AppDelivery = Omit<Delivery, 'date' | 'scheduledDate' | 'actualDate' | 'createdAt' | 'updatedAt'> & {
  date: string | Date;
  scheduledDate?: string | Date | null;
  actualDate?: string | Date | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  customer: Customer & { createdAt?: string | Date; updatedAt?: string | Date; nextDeliveryDate?: string | Date | null };
  entries: (Omit<DeliveryEntry, 'entryDate' | 'createdAt'> & { entryDate: string | Date; createdAt?: string | Date })[];
};
