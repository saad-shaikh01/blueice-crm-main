import { z } from 'zod';

const baseCustomerSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  address: z.string().trim().min(1, 'Address is required'),
  phoneNumber: z.string().trim().min(1, 'Phone number is required'),
  email: z.string().trim().email('Invalid email address'),
  pricingPlan: z.string().trim().min(1, 'Pricing plan is required'),
  deliverySchedule: z.string().trim().min(1, 'Delivery schedule is required'),
  balance: z.coerce.number().optional(),
  emptyBottles: z.coerce.number().optional(),
});

export const createCustomerSchema = baseCustomerSchema;

export const updateCustomerSchema = baseCustomerSchema.partial().refine(
  (value) => Object.values(value).some((val) => val !== undefined),
  { message: 'At least one field must be provided to update the customer.' },
);

export type CustomerFormValues = z.infer<typeof baseCustomerSchema>;
