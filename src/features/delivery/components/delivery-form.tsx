'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

import { DottedSeparator } from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createDeliverySchema, DeliveryFormValues } from '@/features/delivery/schema';

interface DeliveryFormProps {
  initialValues?: Partial<DeliveryFormValues>;
  onSubmit: (values: DeliveryFormValues) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

const emptyEntry = {
  entryDate: new Date(),
  deliveredBottles: 0,
  dropBottle: 0,
  emptyBottle: 0,
  bottleBalance: 0,
  amountDue: 0,
  amountReceived: 0,
  balanceAmount: 0,
  avBottles: 0,
  vanAmount: 0,
};

export const DeliveryForm = ({
  initialValues,
  onSubmit,
  onCancel,
  isSubmitting,
  submitLabel = 'Save delivery',
}: DeliveryFormProps) => {
  const form = useForm<DeliveryFormValues>({
    resolver: zodResolver(createDeliverySchema),
    defaultValues: {
      date: initialValues?.date ? new Date(initialValues.date) : new Date(),
       scheduledDate: initialValues?.scheduledDate ? new Date(initialValues.scheduledDate) : new Date(),
      actualDate: initialValues?.actualDate ? new Date(initialValues.actualDate) : undefined,
      status: initialValues?.status ?? 'PENDING',
      customerId: initialValues?.customerId ?? '',
      deliveryPerson: initialValues?.deliveryPerson ?? '',
      ticketNumber: initialValues?.ticketNumber ?? '',
      code: initialValues?.code ?? '',
      rate: initialValues?.rate ?? 0,
      paymentType: initialValues?.paymentType ?? 'cash',
      previousMonthAmount: initialValues?.previousMonthAmount ?? 0,
      currentMonthPaid: initialValues?.currentMonthPaid ?? 0,
      previousOutstanding: initialValues?.previousOutstanding ?? 0,
      currentOutstanding: initialValues?.currentOutstanding ?? 0,
      previousBalance: initialValues?.previousBalance ?? 0,
      currentBalance: initialValues?.currentBalance ?? 0,
      previousBottleBalance: initialValues?.previousBottleBalance ?? 0,
      currentBottleBalance: initialValues?.currentBottleBalance ?? 0,
      amountDue: initialValues?.amountDue ?? 0,
      amountReceived: initialValues?.amountReceived ?? 0,
      notes: initialValues?.notes ?? '',
      entries: initialValues?.entries?.length ? initialValues.entries : [emptyEntry],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'entries',
  });

  useEffect(() => {
    if (initialValues) {
      form.reset({
        date: initialValues.date ? new Date(initialValues.date) : new Date(),
        scheduledDate: initialValues.scheduledDate ? new Date(initialValues.scheduledDate) : new Date(),
        actualDate: initialValues.actualDate ? new Date(initialValues.actualDate) : undefined,
        status: initialValues.status ?? 'PENDING',
        customerId: initialValues.customerId ?? '',
        deliveryPerson: initialValues.deliveryPerson ?? '',
        ticketNumber: initialValues.ticketNumber ?? '',
        code: initialValues.code ?? '',
        rate: initialValues.rate ?? 0,
        paymentType: initialValues.paymentType ?? 'cash',
        previousMonthAmount: initialValues.previousMonthAmount ?? 0,
        currentMonthPaid: initialValues.currentMonthPaid ?? 0,
        previousOutstanding: initialValues.previousOutstanding ?? 0,
        currentOutstanding: initialValues.currentOutstanding ?? 0,
        previousBalance: initialValues.previousBalance ?? 0,
        currentBalance: initialValues.currentBalance ?? 0,
        previousBottleBalance: initialValues.previousBottleBalance ?? 0,
        currentBottleBalance: initialValues.currentBottleBalance ?? 0,
        amountDue: initialValues.amountDue ?? 0,
        amountReceived: initialValues.amountReceived ?? 0,
        notes: initialValues.notes ?? '',
        entries: initialValues.entries?.length ? initialValues.entries : [emptyEntry],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues]);

  const handleSubmit = (values: z.infer<typeof createDeliverySchema>) => {
    onSubmit({
      ...values,
      scheduledDate: values.scheduledDate ?? values.date,
    });
  };

  return (
    <Card className="border-none shadow-none">
      <CardContent className="p-6 space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slip date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                        onChange={(event) => field.onChange(new Date(event.target.value))}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer ID</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Customer ID" disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deliveryPerson"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivery person ID</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="User ID (optional)" disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ticketNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ticket #</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. 66706" disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer code</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Code" disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rate</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        value={field.value ?? ''}
                        onChange={(event) => {
                          const value = event.target.value;
                          field.onChange(value === '' ? undefined : Number(value));
                        }}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paymentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment type</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="cash / card / online" disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="previousMonthAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Previous month amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        value={field.value ?? ''}
                        onChange={(event) => {
                          const value = event.target.value;
                          field.onChange(value === '' ? undefined : Number(value));
                        }}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currentMonthPaid"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current month paid</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        value={field.value ?? ''}
                        onChange={(event) => {
                          const value = event.target.value;
                          field.onChange(value === '' ? undefined : Number(value));
                        }}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="previousOutstanding"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Previous outstanding</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        value={field.value ?? ''}
                        onChange={(event) => {
                          const value = event.target.value;
                          field.onChange(value === '' ? undefined : Number(value));
                        }}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currentOutstanding"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current outstanding</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        value={field.value ?? ''}
                        onChange={(event) => {
                          const value = event.target.value;
                          field.onChange(value === '' ? undefined : Number(value));
                        }}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} placeholder="Special instructions or notes" disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DottedSeparator />

            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Delivery entries</p>
              <Button type="button" size="sm" onClick={() => append(emptyEntry)} disabled={isSubmitting}>
                Add row
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left">
                    <th className="p-2">Date</th>
                    <th className="p-2">Delivered</th>
                    <th className="p-2">Drop</th>
                    <th className="p-2">Empty</th>
                    <th className="p-2">Balance</th>
                    <th className="p-2">Amount due</th>
                    <th className="p-2">Amount received</th>
                    <th className="p-2">Balance amt</th>
                    <th className="p-2">AV bits</th>
                    <th className="p-2">VAN</th>
                    <th className="p-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {fields.map((field, index) => (
                    <tr key={field.id} className="border-t">
                      <td className="p-2">
                        <Input
                          type="date"
                          disabled={isSubmitting}
                          value={form.watch(`entries.${index}.entryDate`)
                            ? new Date(form.watch(`entries.${index}.entryDate`) as Date).toISOString().split('T')[0]
                            : ''}
                          onChange={(event) =>
                            form.setValue(`entries.${index}.entryDate`, new Date(event.target.value))
                          }
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          type="number"
                          disabled={isSubmitting}
                          value={form.watch(`entries.${index}.deliveredBottles`) ?? ''}
                          onChange={(event) => {
                            const value = event.target.value;
                            form.setValue(`entries.${index}.deliveredBottles`, value === '' ? 0 : Number(value));
                          }}
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          type="number"
                          disabled={isSubmitting}
                          value={form.watch(`entries.${index}.dropBottle`) ?? ''}
                          onChange={(event) => {
                            const value = event.target.value;
                            form.setValue(`entries.${index}.dropBottle`, value === '' ? 0 : Number(value));
                          }}
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          type="number"
                          disabled={isSubmitting}
                          value={form.watch(`entries.${index}.emptyBottle`) ?? ''}
                          onChange={(event) => {
                            const value = event.target.value;
                            form.setValue(`entries.${index}.emptyBottle`, value === '' ? 0 : Number(value));
                          }}
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          type="number"
                          disabled={isSubmitting}
                          value={form.watch(`entries.${index}.bottleBalance`) ?? ''}
                          onChange={(event) => {
                            const value = event.target.value;
                            form.setValue(`entries.${index}.bottleBalance`, value === '' ? 0 : Number(value));
                          }}
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          type="number"
                          step="0.01"
                          disabled={isSubmitting}
                          value={form.watch(`entries.${index}.amountDue`) ?? ''}
                          onChange={(event) => {
                            const value = event.target.value;
                            form.setValue(`entries.${index}.amountDue`, value === '' ? 0 : Number(value));
                          }}
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          type="number"
                          step="0.01"
                          disabled={isSubmitting}
                          value={form.watch(`entries.${index}.amountReceived`) ?? ''}
                          onChange={(event) => {
                            const value = event.target.value;
                            form.setValue(`entries.${index}.amountReceived`, value === '' ? 0 : Number(value));
                          }}
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          type="number"
                          step="0.01"
                          disabled={isSubmitting}
                          value={form.watch(`entries.${index}.balanceAmount`) ?? ''}
                          onChange={(event) => {
                            const value = event.target.value;
                            form.setValue(`entries.${index}.balanceAmount`, value === '' ? 0 : Number(value));
                          }}
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          type="number"
                          disabled={isSubmitting}
                          value={form.watch(`entries.${index}.avBottles`) ?? ''}
                          onChange={(event) => {
                            const value = event.target.value;
                            form.setValue(`entries.${index}.avBottles`, value === '' ? 0 : Number(value));
                          }}
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          type="number"
                          step="0.01"
                          disabled={isSubmitting}
                          value={form.watch(`entries.${index}.vanAmount`) ?? ''}
                          onChange={(event) => {
                            const value = event.target.value;
                            form.setValue(`entries.${index}.vanAmount`, value === '' ? 0 : Number(value));
                          }}
                        />
                      </td>
                      <td className="p-2">
                        <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)} disabled={isSubmitting || fields.length === 1}>
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <DottedSeparator className="py-3" />

            <div className="flex items-center justify-end gap-2">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={isSubmitting}>
                {submitLabel}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
