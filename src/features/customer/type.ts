import type { Customer } from '@prisma/client';

export type AppCustomer = Omit<Customer, 'createdAt' | 'updatedAt'> & {
  createdAt: string | Date;
  updatedAt: string | Date;
  nextDeliveryDate?: string | Date | null;
};
