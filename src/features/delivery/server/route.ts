import { zValidator } from '@hono/zod-validator';
import { Prisma } from '@prisma/client';
import { Hono } from 'hono';
import { z } from 'zod';

import { createDeliverySchema, updateDeliverySchema } from '@/features/delivery/schema';
import { db } from '@/lib/db';
import { sessionMiddleware } from '@/lib/session-middleware';
import { addDays, endOfDay, startOfDay } from 'date-fns';

const paramsSchema = z.object({
  deliveryId: z.string().trim().min(1),
});

const querySchema = z.object({
  search: z.string().trim().optional(),
  date: z.string().trim().optional(),
  status: z.enum(['PENDING', 'SCHEDULED', 'DELIVERED', 'SKIPPED', 'CANCELLED']).optional(),
  range: z.enum(['today', 'tomorrow', 'week']).optional(),
});

const app = new Hono()
  .get('/', sessionMiddleware, zValidator('query', querySchema), async (ctx) => {
    const { search, date, status, range } = ctx.req.valid('query');

    const anchor = date ? new Date(date) : new Date();
    const resolvedRange = range ?? 'today';
    const start = resolvedRange === 'tomorrow' ? startOfDay(addDays(anchor, 1)) : startOfDay(anchor);
    const end =
      resolvedRange === 'week'
        ? endOfDay(addDays(anchor, 6))
        : resolvedRange === 'tomorrow'
          ? endOfDay(addDays(anchor, 1))
          : endOfDay(anchor);

    const dateFilter = {
      gte: start,
      lte: end,
    };

    const filters: any[] = [
      {
        OR: [{ scheduledDate: dateFilter }, { date: dateFilter }, { actualDate: dateFilter }],
      },
    ];

    if (search) {
      filters.push({
        OR: [
          { ticketNumber: { contains: search, mode: 'insensitive' } },
          { code: { contains: search, mode: 'insensitive' } },
          {
            customer: {
              name: { contains: search, mode: 'insensitive' },
            },
          },
        ],
      });
    }

    if (status) {
      filters.push({ status });
    } else {
      filters.push({ status: { in: ['PENDING', 'SCHEDULED'] } });
    }

    const deliveries = await db.delivery.findMany({
      where: { AND: filters },
      include: {
        customer: true,
        entries: true,
      },
      orderBy: { scheduledDate: 'asc' },
    });

    return ctx.json({ data: deliveries });
  })
  .post('/', sessionMiddleware, zValidator('json', createDeliverySchema), async (ctx) => {
    const body = ctx.req.valid('json');
    const userId = ctx.get('userId');

    try {
      const delivery = await db.delivery.create({
        data: {
          date: body.date,
          scheduledDate: body.scheduledDate ?? body.date,
          actualDate: body.actualDate,
          status: body.status ?? 'PENDING',
          customerId: body.customerId,
          deliveryPerson: body.deliveryPerson,
          ticketNumber: body.ticketNumber,
          code: body.code,
          rate: body.rate,
          paymentType: body.paymentType,
          previousMonthAmount: body.previousMonthAmount ?? 0,
          currentMonthPaid: body.currentMonthPaid ?? 0,
          previousOutstanding: body.previousOutstanding ?? 0,
          currentOutstanding: body.currentOutstanding ?? 0,
          previousBalance: body.previousBalance ?? 0,
          currentBalance: body.currentBalance ?? 0,
          previousBottleBalance: body.previousBottleBalance ?? 0,
          currentBottleBalance: body.currentBottleBalance ?? 0,
          amountDue: body.amountDue ?? 0,
          amountReceived: body.amountReceived ?? 0,
          notes: body.notes,
          entries: {
            create: body.entries.map((entry) => ({
              entryDate: entry.entryDate,
              deliveredBottles: entry.deliveredBottles,
              dropBottle: entry.dropBottle,
              emptyBottle: entry.emptyBottle,
              bottleBalance: entry.bottleBalance,
              amountDue: entry.amountDue,
              amountReceived: entry.amountReceived,
              balanceAmount: entry.balanceAmount,
              avBottles: entry.avBottles,
              vanAmount: entry.vanAmount,
            })),
          },
        },
        include: {
          customer: true,
          entries: true,
        },
      });

      return ctx.json({ data: delivery }, 201);
    } catch (error) {
      console.error('[DELIVERY_CREATE]', error);
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
        return ctx.json({ error: 'Invalid customer or user reference' }, 400);
      }
      return ctx.json({ error: 'Failed to create delivery' }, 500);
    }
  })
  .patch(
    '/:deliveryId',
    sessionMiddleware,
    zValidator('param', paramsSchema),
    zValidator('json', updateDeliverySchema),
    async (ctx) => {
      const { deliveryId } = ctx.req.valid('param');
      const body = ctx.req.valid('json');

      const entryUpdates = body.entries
        ? {
          deleteMany: {},
          create: body.entries.map((entry) => ({
            entryDate: entry.entryDate,
            deliveredBottles: entry.deliveredBottles,
            dropBottle: entry.dropBottle,
            emptyBottle: entry.emptyBottle,
            bottleBalance: entry.bottleBalance,
            amountDue: entry.amountDue,
            amountReceived: entry.amountReceived,
            balanceAmount: entry.balanceAmount,
            avBottles: entry.avBottles,
            vanAmount: entry.vanAmount,
          })),
        }
        : undefined;

      try {
        const delivery = await db.delivery.update({
          where: { id: deliveryId },
          data: {
            ...(body.date ? { date: body.date } : {}),
            ...(body.scheduledDate ? { scheduledDate: body.scheduledDate } : {}),
            ...(body.actualDate ? { actualDate: body.actualDate } : {}),
            ...(body.status ? { status: body.status } : {}),
            ...(body.customerId ? { customerId: body.customerId } : {}),
            ticketNumber: body.ticketNumber ?? undefined,
            code: body.code ?? undefined,
            rate: body.rate ?? undefined,
            paymentType: body.paymentType ?? undefined,
            previousMonthAmount: body.previousMonthAmount ?? undefined,
            currentMonthPaid: body.currentMonthPaid ?? undefined,
            previousOutstanding: body.previousOutstanding ?? undefined,
            currentOutstanding: body.currentOutstanding ?? undefined,
            previousBalance: body.previousBalance ?? undefined,
            currentBalance: body.currentBalance ?? undefined,
            previousBottleBalance: body.previousBottleBalance ?? undefined,
            currentBottleBalance: body.currentBottleBalance ?? undefined,
            amountDue: body.amountDue ?? undefined,
            amountReceived: body.amountReceived ?? undefined,
            notes: body.notes ?? undefined,
            entries: entryUpdates,
          },
          include: {
            customer: true,
            entries: true,
          },
        });

        return ctx.json({ data: delivery });
      } catch (error) {
        console.error('[DELIVERY_UPDATE]', error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2025') {
            return ctx.json({ error: 'Delivery not found' }, 404);
          }
          if (error.code === 'P2003') {
            return ctx.json({ error: 'Invalid customer reference' }, 400);
          }
        }
        return ctx.json({ error: 'Failed to update delivery' }, 500);
      }
    },
  )
  .delete('/:deliveryId', sessionMiddleware, zValidator('param', paramsSchema), async (ctx) => {
    const { deliveryId } = ctx.req.valid('param');

    try {
      await db.deliveryEntry.deleteMany({ where: { deliveryId } });
      await db.deliveryProduct.deleteMany({ where: { deliveryId } });
      await db.invoice.deleteMany({ where: { deliveryId } });
      await db.delivery.delete({ where: { id: deliveryId } });

      return ctx.json({ success: true });
    } catch (error) {
      console.error('[DELIVERY_DELETE]', error);
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return ctx.json({ error: 'Delivery not found' }, 404);
      }
      return ctx.json({ error: 'Failed to delete delivery' }, 500);
    }
  })
  .post('/schedule', sessionMiddleware, zValidator('json', z.object({ date: z.string().optional() })), async (ctx) => {
    const { date } = ctx.req.valid('json');
    const targetDate = date ? new Date(date) : addDays(new Date(), 1);
    const dayName = targetDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

    const customers = await db.customer.findMany({
      where: { deliveryDay: dayName },
    });

    const deliveries = await Promise.all(
      customers.map((customer) =>
        db.delivery.create({
          data: {
            date: targetDate,
            scheduledDate: targetDate,
            status: 'SCHEDULED',
            customerId: customer.id,
            deliveryPerson: customer.userId ?? null,
            rate: undefined,
            entries: {
              create: [
                {
                  entryDate: targetDate,
                  deliveredBottles: 0,
                  dropBottle: 0,
                  emptyBottle: 0,
                  bottleBalance: customer.bottleBalance ?? 0,
                  amountDue: 0,
                  amountReceived: 0,
                  balanceAmount: customer.balance ?? 0,
                  avBottles: 0,
                  vanAmount: 0,
                },
              ],
            },
          },
          include: { customer: true, entries: true },
        }),
      ),
    );

    return ctx.json({ data: deliveries });
  })
  .get('/history/:customerId', sessionMiddleware, zValidator('param', z.object({ customerId: z.string() })), async (ctx) => {
    const { customerId } = ctx.req.valid('param');

    const deliveries = await db.delivery.findMany({
      where: { customerId, status: 'DELIVERED' },
      include: { entries: true },
      orderBy: { date: 'desc' },
      take: 5,
    });

    return ctx.json({ data: deliveries });
  })
  .patch('/:deliveryId/complete', sessionMiddleware, zValidator('param', paramsSchema), zValidator('json', createDeliverySchema.partial().extend({
    entries: z.array(z.object({
      entryDate: z.coerce.date(),
      deliveredBottles: z.coerce.number().int().min(0),
      dropBottle: z.coerce.number().int().min(0),
      emptyBottle: z.coerce.number().int().min(0),
      bottleBalance: z.coerce.number().int().min(0),
      amountDue: z.coerce.number().min(0),
      amountReceived: z.coerce.number().min(0),
      balanceAmount: z.coerce.number().min(0),
      avBottles: z.coerce.number().int().min(0).optional(),
      vanAmount: z.coerce.number().min(0).optional(),
    })).min(1),
    paymentType: z.enum(['cash', 'online', 'card']).optional(),
  })), async (ctx) => {
    const { deliveryId } = ctx.req.valid('param');
    const body = ctx.req.valid('json');
    const userId = ctx.get('userId');

    const delivery = await db.delivery.findUnique({
      where: { id: deliveryId },
      include: { customer: true, entries: true },
    });
    if (!delivery) {
      return ctx.json({ error: 'Delivery not found' }, 404);
    }

    const customer = delivery.customer;

    const totalDelivered = body.entries?.reduce((sum, e) => sum + (e.deliveredBottles ?? 0), 0) ?? 0;
    const totalEmpty = body.entries?.reduce((sum, e) => sum + (e.emptyBottle ?? 0), 0) ?? 0;
    const totalDue = body.entries?.reduce((sum, e) => sum + (e.amountDue ?? 0), 0) ?? 0;
    const totalReceived = body.entries?.reduce((sum, e) => sum + (e.amountReceived ?? 0), 0) ?? 0;

    const prevBottleBalance = customer.bottleBalance ?? 0;
    const prevBalance = customer.balance ?? 0;

    const newBottleBalance = prevBottleBalance + totalDelivered - totalEmpty;
    const newBalance = prevBalance + totalDue - totalReceived;

    const updatedDelivery = await db.delivery.update({
      where: { id: deliveryId },
      data: {
        status: 'DELIVERED',
        actualDate: body.actualDate ?? new Date(),
        paymentType: body.paymentType ?? delivery.paymentType,
        previousBalance: prevBalance,
        currentBalance: newBalance,
        previousBottleBalance: prevBottleBalance,
        currentBottleBalance: newBottleBalance,
        amountDue: totalDue,
        amountReceived: totalReceived,
        entries: {
          deleteMany: {},
          create: body.entries?.map((entry) => ({
            entryDate: entry.entryDate,
            deliveredBottles: entry.deliveredBottles,
            dropBottle: entry.dropBottle,
            emptyBottle: entry.emptyBottle,
            bottleBalance: entry.bottleBalance,
            amountDue: entry.amountDue,
            amountReceived: entry.amountReceived,
            balanceAmount: entry.balanceAmount,
            avBottles: entry.avBottles,
            vanAmount: entry.vanAmount,
          })) ?? [],
        },
      },
      include: { entries: true, customer: true },
    });

    await db.customer.update({
      where: { id: customer.id },
      data: {
        balance: newBalance,
        bottleBalance: newBottleBalance,
        nextDeliveryDate: customer.nextDeliveryDate
          ? addDays(customer.nextDeliveryDate, 7)
          : addDays(new Date(), 7),
      },
    });

    const recentDeliveries = await db.delivery.findMany({
      where: { customerId: customer.id },
      orderBy: { actualDate: 'desc' },
      take: 5,
      include: { entries: true },
    });

    await db.invoice.create({
      data: {
        amount: totalDue,
        status: newBalance <= 0 ? 'PAID' : 'UNPAID',
        customerId: customer.id,
        deliveryId: deliveryId,
        createdById: userId ?? null,
      },
    });

    return ctx.json({ data: updatedDelivery, history: recentDeliveries });
  });

export default app;
