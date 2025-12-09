'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { DottedSeparator } from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CustomerFormValues, createCustomerSchema } from '@/features/customer/schema';

interface CustomerFormProps {
  initialValues?: Partial<CustomerFormValues>;
  onSubmit: (values: CustomerFormValues) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

export const CustomerForm = ({
  initialValues,
  onSubmit,
  onCancel,
  isSubmitting,
  submitLabel = 'Save customer',
}: CustomerFormProps) => {
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(createCustomerSchema),
    defaultValues: {
      name: initialValues?.name ?? '',
      email: initialValues?.email ?? '',
      phoneNumber: initialValues?.phoneNumber ?? '',
      address: initialValues?.address ?? '',
      pricingPlan: initialValues?.pricingPlan ?? '',
      deliverySchedule: initialValues?.deliverySchedule ?? '',
      balance: initialValues?.balance ?? 0,
      emptyBottles: initialValues?.emptyBottles ?? 0,
    },
  });

  useEffect(() => {
    if (initialValues) {
      form.reset({
        name: initialValues.name ?? '',
        email: initialValues.email ?? '',
        phoneNumber: initialValues.phoneNumber ?? '',
        address: initialValues.address ?? '',
        pricingPlan: initialValues.pricingPlan ?? '',
        deliverySchedule: initialValues.deliverySchedule ?? '',
        balance: initialValues.balance ?? 0,
        emptyBottles: initialValues.emptyBottles ?? 0,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues]);

  const handleSubmit = (values: z.infer<typeof createCustomerSchema>) => {
    onSubmit(values);
  };

  return (
    <Card className="border-none shadow-none">
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                disabled={isSubmitting}
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Customer name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={isSubmitting}
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} placeholder="customer@email.com" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={isSubmitting}
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone number</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="+1 555 000 1234" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={isSubmitting}
                control={form.control}
                name="pricingPlan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pricing plan</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Standard / Custom" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={isSubmitting}
                control={form.control}
                name="deliverySchedule"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivery schedule</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Weekly, bi-weekly..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  disabled={isSubmitting}
                  control={form.control}
                  name="balance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Balance</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          value={field.value ?? ''}
                          onChange={(event) => {
                            const value = event.target.value;
                            field.onChange(value === '' ? undefined : Number(value));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  disabled={isSubmitting}
                  control={form.control}
                  name="emptyBottles"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Empty bottles</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          value={field.value ?? ''}
                          onChange={(event) => {
                            const value = event.target.value;
                            field.onChange(value === '' ? undefined : Number(value));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <FormField
              disabled={isSubmitting}
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} placeholder="Delivery address" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
