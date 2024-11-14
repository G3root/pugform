import { db } from '@pugform/database'
import { redirect } from 'react-router'
import type { AppLoadContext } from 'react-router'
import { createOrganization } from '~/modules/organization/services'
import { createUser } from '~/modules/user/services'
import { createWorkSpaceHandler } from '~/modules/workspace/procedures/create-workspace'
import { hashPassword, verifyPasswordHash } from './password.server'
import { createSession, generateSessionToken } from './session.server'
import { shortId } from './uuid'

export async function checkEmailAvailability(email: string) {
	const emailAvailable = await db
		.selectFrom('user')
		.where('email', '=', email)
		.select('id')
		.executeTakeFirst()

	return !!emailAvailable
}

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

interface SignupOptions {
	email: string
	name: string
	password: string
}

export async function signUp({ email, name, password }: SignupOptions) {
	const user = await createUser({ email, name, password }, db)

	const userId = user.id

	const organization = await createOrganization(db, {
		name: `${name} org`,
		userId,
	})

	const membershipId = organization.membership.id
	const organizationId = organization.organization.id

	await createWorkSpaceHandler({
		db,
		membershipId: organization.membership.id,
		organizationId: organization.organization.id,
		name: 'my workspace',
	})

	const sessionToken = generateSessionToken()

	const session = await createSession(
		{ token: sessionToken, membershipId, organizationId, userId },
		db,
	)

	return { ...session, sessionToken }
}
