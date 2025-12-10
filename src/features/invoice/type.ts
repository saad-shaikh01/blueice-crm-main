import { z } from 'zod';

export type Invoice = {
  id: string;
  amount: number;
  date: string | Date;
  status: 'PAID' | 'UNPAID' | 'PENDING';
  customerId: string;
  customer: {
    name: string;
    address: string;
  };
  deliveryId?: string | null;
  createdById?: string | null;
};
