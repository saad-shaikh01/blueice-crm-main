import { Hono } from 'hono';
import { handle } from 'hono/vercel';

import auth from '@/features/auth/server/route';
import customer from '@/features/customer/server/route';
import product from '@/features/product/server/route';
import delivery from '@/features/delivery/server/route';
import invoice from '@/features/invoice/server/route';

export const runtime = 'nodejs';

const app = new Hono().basePath('/api');


app.get('/hello', (c) => {
  return c.json({
    message: 'Hello Next.js!',
  })
})

// app.use('*', cook()); // Enable cookie parsing for all routes

const routes = app
  .route('/auth', auth)
  .route('/customers', customer)
  .route('/products', product)
  .route('/deliveries', delivery)
  .route('/invoices', invoice);


export type AppType = typeof routes;

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);
