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
		throw redirect('/dashboard/login')
	}

	return { session: context.session, user: context.user }
}

function safeURL(url: URL | string): URL | null {
	try {
		return new URL(url)
	} catch {
		return null
	}
}

export function verifyRequestOrigin(
	origin: string,
	allowedDomains: string[],
): boolean {
	if (!origin || allowedDomains.length === 0) {
		return false
	}
	const originHost = safeURL(origin)?.host ?? null
	if (!originHost) {
		return false
	}
	for (const domain of allowedDomains) {
		let host: string | null
		if (domain.startsWith('http://') || domain.startsWith('https://')) {
			host = safeURL(domain)?.host ?? null
		} else {
			host = safeURL(`https://${domain}`)?.host ?? null
		}
		if (originHost === host) {
			return true
		}
	}
	return false
}
