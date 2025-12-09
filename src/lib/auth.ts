// export const getCurrentUser = async () => {
//   const { userId } = auth();
  
//   if (!userId) {
//     return null;
//   }
  
//   return userId;
// };

// export const isAuthenticated = async () => {
//   const userId = await getCurrentUser();
//   return !!userId;
// };


// // // lib/auth.ts
// import { auth } from "@clerk/nextjs";
// import { clerkClient } from "@clerk/nextjs/server";
// import { createMiddleware } from 'hono/factory';
// import 'server-only';

// interface CustomVariables {
//   userId: string;
// }

// export const authMiddleware = createMiddleware<{ Variables: CustomVariables }>(
//   async (ctx, next) => {
//     const { userId } = auth();

//     if (!userId) {
//       return ctx.json({ error: "Unauthorized." }, 401);
//     }

//     ctx.set("userId", userId); // ✅ TypeScript error nahi dega

//     await next();
//   }
// );


// export async function createAdminClient() {
//   return {
//     get users() {
//       return clerkClient.users;
//     },
//   };
// }