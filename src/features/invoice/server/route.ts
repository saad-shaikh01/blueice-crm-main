import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';
import { db } from '@/lib/db';
import { sessionMiddleware } from '@/lib/session-middleware';

const app = new Hono()
  .get('/', sessionMiddleware, async (ctx) => {
    const user = ctx.get('user');

    if (user.role !== 'ADMIN') {
      return ctx.json({ error: 'Unauthorized' }, 403);
    }

    const invoices = await db.invoice.findMany({
      include: {
        customer: {
          select: {
            name: true,
            address: true,
          }
        }
      },
      orderBy: { date: 'desc' },
      take: 100,
    });

    return ctx.json({ data: invoices });
  })
  .get('/:invoiceId', sessionMiddleware, async (ctx) => {
    const invoiceId = ctx.req.param('invoiceId');
    const invoice = await db.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        customer: true,
        delivery: {
          include: {
            entries: true,
          }
        }
      }
    });

    if (!invoice) {
        return ctx.json({ error: 'Invoice not found' }, 404);
    }
    return ctx.json({ data: invoice });
  });

export default app;
