import { zValidator } from '@hono/zod-validator';
import { Prisma } from '@prisma/client';
import { Hono } from 'hono';
import { z } from 'zod';

import { createProductSchema, updateProductSchema } from '@/features/product/schema';
import { db } from '@/lib/db';
import { sessionMiddleware } from '@/lib/session-middleware';

const paramsSchema = z.object({
  productId: z.string().trim().min(1),
});

const querySchema = z.object({
  search: z.string().trim().optional(),
});

const app = new Hono()
  .get('/', sessionMiddleware, zValidator('query', querySchema), async (ctx) => {
    const { search } = ctx.req.valid('query');

    const products = await db.product.findMany({
      where: search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
            ],
          }
        : undefined,
      orderBy: { createdAt: 'desc' },
    });

    return ctx.json({ data: products });
  })
  .post('/', sessionMiddleware, zValidator('json', createProductSchema), async (ctx) => {
    const body = ctx.req.valid('json');

    try {
      const product = await db.product.create({
        data: body,
      });

      return ctx.json({ data: product }, 201);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        return ctx.json({ error: 'Product already exists' }, 400);
      }

      console.error('[PRODUCT_CREATE]', error);
      return ctx.json({ error: 'Failed to create product' }, 500);
    }
  })
  .patch(
    '/:productId',
    sessionMiddleware,
    zValidator('param', paramsSchema),
    zValidator('json', updateProductSchema),
    async (ctx) => {
      const { productId } = ctx.req.valid('param');
      const body = ctx.req.valid('json');

      try {
        const product = await db.product.update({
          where: { id: productId },
          data: body,
        });

        return ctx.json({ data: product });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            return ctx.json({ error: 'Product already exists' }, 400);
          }
          if (error.code === 'P2025') {
            return ctx.json({ error: 'Product not found' }, 404);
          }
        }

        console.error('[PRODUCT_UPDATE]', error);
        return ctx.json({ error: 'Failed to update product' }, 500);
      }
    },
  )
  .delete('/:productId', sessionMiddleware, zValidator('param', paramsSchema), async (ctx) => {
    const { productId } = ctx.req.valid('param');

    try {
      await db.product.delete({
        where: { id: productId },
      });

      return ctx.json({ success: true });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return ctx.json({ error: 'Product not found' }, 404);
      }

      console.error('[PRODUCT_DELETE]', error);
      return ctx.json({ error: 'Failed to delete product' }, 500);
    }
  });

export default app;
