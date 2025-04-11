import { initTRPC } from '@trpc/server';
import { transformer } from '../shared/transformer';
import type { TRPCContext } from './context';
import { withAuthTrpcContext } from './context';
/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.context<TRPCContext>().create({
  transformer,
});

export const authenticatedMiddleware = t.middleware(
  async ({ ctx: ctx_, next }) => {
    const ctx = await withAuthTrpcContext(ctx_);

    return next({
      ctx,
    });
  }
);

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(authenticatedMiddleware);
