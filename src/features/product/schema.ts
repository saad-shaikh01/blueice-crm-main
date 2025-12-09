import { z } from 'zod';

const baseProductSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  description: z.string().trim().optional(),
  quantity: z.coerce.number().int().min(0, 'Quantity cannot be negative'),
  price: z.coerce.number().min(0, 'Price cannot be negative'),
});

export const createProductSchema = baseProductSchema;

export const updateProductSchema = baseProductSchema.partial().refine(
  (values) => Object.values(values).some((value) => value !== undefined),
  { message: 'At least one field is required to update the product.' },
);

export type ProductFormValues = z.infer<typeof baseProductSchema>;
