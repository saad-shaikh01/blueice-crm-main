import { zValidator } from '@hono/zod-validator';
import { Prisma } from '@prisma/client';
import { Hono } from 'hono';
import { z } from 'zod';

import { createCustomerSchema, updateCustomerSchema } from '@/features/customer/schema';
import { db } from '@/lib/db';
import { sessionMiddleware } from '@/lib/session-middleware';

const paramsSchema = z.object({
  customerId: z.string().trim().min(1),
});

const querySchema = z.object({
  search: z.string().trim().optional(),
});

const app = new Hono()
  .get('/', sessionMiddleware, zValidator('query', querySchema), async (ctx) => {
    const { search } = ctx.req.valid('query');

    const customers = await db.customer.findMany({
      where: search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
              { phoneNumber: { contains: search, mode: 'insensitive' } },
            ],
          }
        : undefined,
      orderBy: { createdAt: 'desc' },
    });

    return ctx.json({ data: customers });
  })
  .post('/', sessionMiddleware, zValidator('json', createCustomerSchema), async (ctx) => {
    const body = ctx.req.valid('json');
    const userId = ctx.get('userId');

    try {
      const customer = await db.customer.create({
        data: {
          ...body,
          userId,
          balance: body.balance ?? 0,
          emptyBottles: body.emptyBottles ?? 0,
        },
      });

      return ctx.json({ data: customer }, 201);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        return ctx.json({ error: 'Customer email already exists' }, 400);
      }

      console.error('[CUSTOMER_CREATE]', error);
      return ctx.json({ error: 'Failed to create customer' }, 500);
    }
  })
  .patch(
    '/:customerId',
    sessionMiddleware,
    zValidator('param', paramsSchema),
    zValidator('json', updateCustomerSchema),
    async (ctx) => {
      const { customerId } = ctx.req.valid('param');
      const body = ctx.req.valid('json');

      try {
        const customer = await db.customer.update({
          where: { id: customerId },
          data: body,
        });

        return ctx.json({ data: customer });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            return ctx.json({ error: 'Customer email already exists' }, 400);
          }
          if (error.code === 'P2025') {
            return ctx.json({ error: 'Customer not found' }, 404);
          }
        }

        console.error('[CUSTOMER_UPDATE]', error);
        return ctx.json({ error: 'Failed to update customer' }, 500);
      }
    },
  )
  .delete('/:customerId', sessionMiddleware, zValidator('param', paramsSchema), async (ctx) => {
    const { customerId } = ctx.req.valid('param');

    try {
      await db.customer.delete({
        where: { id: customerId },
      });

      return ctx.json({ success: true });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return ctx.json({ error: 'Customer not found' }, 404);
      }

      console.error('[CUSTOMER_DELETE]', error);
      return ctx.json({ error: 'Failed to delete customer' }, 500);
    }
  });

export default app;
