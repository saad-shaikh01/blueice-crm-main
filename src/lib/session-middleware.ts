// import { getCookie } from 'hono/cookie';
// import { createMiddleware } from 'hono/factory';
// import {
//   Account,
//   type Account as AccountType,
//   Client,
//   Databases,
//   type Databases as DatabasesType,
//   type Models,
//   Storage,
//   Storage as StorageType,
//   type Users as UsersType,
// } from 'node-appwrite';
// import 'server-only';

// import { AUTH_COOKIE } from '@/features/auth/constants';

// type AdditionalContext = {
//   Variables: {
//     account: AccountType;
//     databases: DatabasesType;
//     storage: StorageType;
//     users: UsersType;
//     user: Models.User<Models.Preferences>;
//   };
// };

// export const sessionMiddleware = createMiddleware<AdditionalContext>(async (ctx, next) => {
//   const client = new Client().setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!).setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

//   const session = getCookie(ctx, AUTH_COOKIE);

//   if (!session) {
//     return ctx.json({ error: 'Unauthorized.' }, 401);
//   }

//   client.setSession(session);

//   const account = new Account(client);
//   const databases = new Databases(client);
//   const storage = new Storage(client);

//   const user = await account.get();

//   ctx.set('account', account);
//   ctx.set('databases', databases);
//   ctx.set('storage', storage);
//   ctx.set('user', user);

//   await next();
// });



import { getCookie } from 'hono/cookie';
import { createMiddleware } from 'hono/factory';
import 'server-only';

import { AUTH_COOKIE } from '@/features/auth/constants';
import { verifyToken } from './authenticate';


type AdditionalContext = {
  Variables: {
    // account: AccountType;
    // databases: DatabasesType;
    // storage: StorageType;
    userId: string;
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
    };

  };
};

export const sessionMiddleware = createMiddleware<AdditionalContext>(async (ctx, next) => {
  const session = getCookie(ctx, AUTH_COOKIE);

  if (!session) {
    return ctx.json({ error: 'Unauthorized.' }, 401);
  }

  const user = await verifyToken(session);
  
  if (!user) {
    return ctx.json({ error: 'Invalid or expired session.' }, 401);
  }

  // Set user info in context
  ctx.set('userId', user.id);
  ctx.set('user', user);

  await next();
});


// import { createMiddleware } from 'hono/factory';
// import { db } from '@/lib/db';
// import 'server-only';
// import { getCurrentUser } from './auth';

// export const sessionMiddleware = createMiddleware(async (ctx, next) => {
//   const userId = await getCurrentUser();

//   if (!userId) {
//     return ctx.json({ error: 'Unauthorized.' }, 401);
//   }

//   // Prisma se user find karo
//   const user = await db.user.findUnique({
//     where: { id: userId }, // Kyunki Clerk ka `auth()` userId return karta hai
//   });

//   if (!user) {
//     return ctx.json({ error: 'Unauthorized.' }, 401);
//   }

//   ctx.set('user', user);

//   await next();
// });
