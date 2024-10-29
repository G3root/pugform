import { type AppLoadContext, redirect } from '@remix-run/node'
import { db } from '~/lib/db.server'
import { hashPassword, verifyPasswordHash } from './password.server'
import { createSession, generateSessionToken } from './session.server'
import { shortId } from './uuid'

interface loginOptions {
	email: string
	password: string
}

export async function login(options: loginOptions) {
	const existingUser = await db
		.selectFrom('user')
		.where('email', '=', options.email)
		.select(['passwordHash', 'id'])
		.executeTakeFirst()

	const randomHash = await hashPassword(shortId(12))
	const isValid = await verifyPasswordHash(
		existingUser?.passwordHash ?? randomHash,
		options.password,
	)

	if (!isValid || !existingUser) {
		return null
	}

	const membership = await db
		.selectFrom('membership')
		.where('userId', '=', existingUser.id)
		.orderBy('lastAccessed', 'desc')
		.select(['id as membershipId', 'organizationId', 'userId'])
		.executeTakeFirstOrThrow()

	const sessionToken = generateSessionToken()
	const session = await createSession(
		{ ...membership, token: sessionToken },
		db,
	)

	return { ...session, sessionToken }
}

export function requireAnonymous(context: AppLoadContext) {
	if (context.session && context.user) {
		throw redirect('/')
	}
}

export function requireAuth(context: AppLoadContext) {
	if (!context.session || !context.user) {
		throw redirect('/login')
	}

	return { session: context.session, user: context.user }
}
