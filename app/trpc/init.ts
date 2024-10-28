import type { AppLoadContext } from '@remix-run/node'
import { TRPCError, initTRPC } from '@trpc/server'
import superjson from 'superjson'
import { db } from '~/lib/db.server'

export interface createTRPCContextOptions {
	context: AppLoadContext
	request: Request
}

export const createTRPCContext = ({
	context,
	request,
}: createTRPCContextOptions) => {
	const session =
		context.session && context.user
			? {
					...context.session,
					user: context.user,
				}
			: null
	return {
		db,
		session,
		request,
	}
}

export type TCreateTRPCContextType = Awaited<
	ReturnType<typeof createTRPCContext>
>

const withAuthTrpcContext = ({ session, ...rest }: TCreateTRPCContextType) => {
	if (!session) {
		throw new TRPCError({ code: 'UNAUTHORIZED' })
	}

	return {
		...rest,
		session,
	}
}

export type TWithAuthTrpcContextType = ReturnType<typeof withAuthTrpcContext>

const t = initTRPC.context<TCreateTRPCContextType>().create({
	/**
	 * @see https://trpc.io/docs/server/data-transformers
	 */
	transformer: superjson,
})

const enforceAuthMiddleware = t.middleware((opts) => {
	const ctx = withAuthTrpcContext(opts.ctx)

	return opts.next({
		ctx,
	})
})

// Base router and procedure helpers
export const createTRPCRouter = t.router
export const baseProcedure = t.procedure
export const createCallerFactory = t.createCallerFactory
export const withAuthProcedure = t.procedure.use(enforceAuthMiddleware)
