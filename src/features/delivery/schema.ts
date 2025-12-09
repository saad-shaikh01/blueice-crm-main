import { z } from 'zod';

const deliveryEntrySchema = z.object({
  entryDate: z.coerce.date(),
  deliveredBottles: z.coerce.number().int().min(0, 'Delivered bottles cannot be negative'),
  dropBottle: z.coerce.number().int().min(0, 'Drop bottle cannot be negative'),
  emptyBottle: z.coerce.number().int().min(0, 'Empty bottle cannot be negative'),
  bottleBalance: z.coerce.number().int().min(0, 'Bottle balance cannot be negative'),
  amountDue: z.coerce.number().min(0, 'Amount due cannot be negative'),
  amountReceived: z.coerce.number().min(0, 'Amount received cannot be negative'),
  balanceAmount: z.coerce.number().min(0, 'Balance amount cannot be negative'),
  avBottles: z.coerce.number().int().min(0).optional(),
  vanAmount: z.coerce.number().min(0).optional(),
});

const baseDeliverySchema = z.object({
  date: z.coerce.date(),
  scheduledDate: z.coerce.date().optional(),
  actualDate: z.coerce.date().optional(),
  status: z.enum(['PENDING', 'SCHEDULED', 'DELIVERED', 'SKIPPED', 'CANCELLED']).optional(),
  customerId: z.string().trim().min(1, 'Customer is required'),
  deliveryPerson: z.string().trim().optional(),
  ticketNumber: z.string().trim().optional(),
  code: z.string().trim().optional(),
  rate: z.coerce.number().min(0).optional(),
  paymentType: z.enum(['cash', 'online', 'card']).optional(),
  previousMonthAmount: z.coerce.number().min(0).optional(),
  currentMonthPaid: z.coerce.number().min(0).optional(),
  previousOutstanding: z.coerce.number().min(0).optional(),
  currentOutstanding: z.coerce.number().min(0).optional(),
  previousBalance: z.coerce.number().min(0).optional(),
  currentBalance: z.coerce.number().min(0).optional(),
  previousBottleBalance: z.coerce.number().int().min(0).optional(),
  currentBottleBalance: z.coerce.number().int().min(0).optional(),
  amountDue: z.coerce.number().min(0).optional(),
  amountReceived: z.coerce.number().min(0).optional(),
  notes: z.string().trim().optional(),
  entries: z.array(deliveryEntrySchema).min(1, 'At least one entry is required'),
});

export const createDeliverySchema = baseDeliverySchema;

export const updateDeliverySchema = baseDeliverySchema
  .partial()
  .extend({
    entries: z.array(deliveryEntrySchema).min(1).optional(),
  })
  .refine((value) => Object.values(value).some((val) => val !== undefined), {
    message: 'Provide at least one field to update.',
  });

export type DeliveryEntryInput = z.infer<typeof deliveryEntrySchema>;
export type DeliveryFormValues = z.infer<typeof baseDeliverySchema>;
