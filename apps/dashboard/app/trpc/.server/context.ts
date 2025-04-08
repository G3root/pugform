import { db } from '@pugform/database'
import { TRPCError } from '@trpc/server'
import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'
import { auth } from '~/lib/auth'

export const createContext = async (opts: FetchCreateContextFnOptions) => {
	const session = await auth.api.getSession({ headers: opts.req.headers })

	return {
		session,
		db,
	}
}

export type TRPCContext = Awaited<ReturnType<typeof createContext>>

export const withAuthTrpcContext = ({ session, ...rest }: TRPCContext) => {
	if (!session) {
		throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Unauthorized' })
	}

	if (!session.session.activeOrganizationId) {
		throw new TRPCError({
			code: 'UNAUTHORIZED',
			message: 'Organization not found',
		})
	}

	if (!session.session.activeMemberId) {
		throw new TRPCError({
			code: 'UNAUTHORIZED',
			message: 'Member not found',
		})
	}

	return {
		...rest,
		session: {
			...session,
			session: {
				...session.session,
				activeOrganizationId: session.session.activeOrganizationId,
				activeMemberId: session.session.activeMemberId,
			},
		},
	}
}

export type TWithAuthTrpcContext = Awaited<
	ReturnType<typeof withAuthTrpcContext>
>
