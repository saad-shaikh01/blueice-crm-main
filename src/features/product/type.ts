import type { Product } from '@prisma/client';

export type AppProduct = Omit<Product, 'createdAt' | 'updatedAt'> & {
  createdAt: string | Date;
  updatedAt: string | Date;
};
