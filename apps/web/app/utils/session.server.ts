import { sha256 } from '@oslojs/crypto/sha2'
import {
	encodeBase32LowerCaseNoPadding,
	encodeHexLowerCase,
} from '@oslojs/encoding'
import * as cookies from 'cookie'
import type { TKyselyDb } from '~/lib/db.server'

export const SESSION_EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 30
export const getSessionExpirationDate = () =>
	new Date(Date.now() + SESSION_EXPIRATION_TIME)

export const sessionKey = 'sessionId'

export async function validateSessionToken(
	token: string,
	db: TKyselyDb,
): Promise<SessionValidationResult> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))

	const row = await db
		.selectFrom('session')
		.where('id', '=', sessionId)
		.select(['expiresAt', 'id', 'userId', 'organizationId', 'membershipId'])
		.executeTakeFirst()

	if (!row) {
		return { session: null, user: null }
	}
	const session: Session = {
		...row,
		expiresAt: new Date(row.expiresAt * 1000),
	}

	const user = await getUser(session, db)

	if (!user) {
		return { session: null, user: null }
	}

	if (Date.now() >= session.expiresAt.getTime()) {
		await invalidateSession(session.id, db)
		return { session: null, user: null }
	}
	if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
		session.expiresAt = getSessionExpirationDate()

		await db
			.updateTable('session')
			.where('id', '=', session.id)
			.set({
				expiresAt: Math.floor(session.expiresAt.getTime() / 1000),
				updatedAt: new Date().toISOString(),
			})
			.execute()
	}

	return { session, user }
}

async function getUser(
	session: Session,
	db: TKyselyDb,
): Promise<SessionUser | null> {
	const membership = await db
		.selectFrom('membership')
		.where('id', '=', session.membershipId)
		.select(['id'])
		.executeTakeFirst()

	if (!membership) {
		return null
	}

	const user = await db
		.selectFrom('user')
		.where('id', '=', session.userId)
		.select(['name', 'email'])
		.executeTakeFirst()

	if (!user) {
		return null
	}

	const organization = await db
		.selectFrom('organization')
		.where('id', '=', session.organizationId)
		.select(['id', 'name'])
		.executeTakeFirst()

	if (!organization) {
		return null
	}

	return {
		user,
		membership,
		organization,
	}
}

export async function createSession(
	{
		membershipId,
		organizationId,
		token,
		userId,
	}: {
		token: string
		userId: string
		organizationId: string
		membershipId: string
	},
	db: TKyselyDb,
): Promise<Session> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))
	const session: Session = {
		id: sessionId,
		userId,
		expiresAt: getSessionExpirationDate(),
		organizationId,
		membershipId,
	}

	await db
		.insertInto('session')
		.values({
			id: session.id,
			organizationId: session.organizationId,
			userId: session.userId,
			expiresAt: Math.floor(session.expiresAt.getTime() / 1000),
			membershipId: session.membershipId,
			createdAt: new Date(),
			updatedAt: new Date(),
		})
		.executeTakeFirstOrThrow()
	return session
}

export function generateSessionToken(): string {
	const tokenBytes = new Uint8Array(20)
	crypto.getRandomValues(tokenBytes)
	const token = encodeBase32LowerCaseNoPadding(tokenBytes).toLowerCase()
	return token
}

export async function invalidateSession(
	sessionId: string,
	db: TKyselyDb,
): Promise<void> {
	await db.deleteFrom('session').where('id', '=', sessionId).execute()
}

export const getSessionCookie = (cookie: string) => {
	return cookies.parse(cookie)?.[sessionKey]
}

export function deleteSessionTokenCookie() {
	const cookie = cookies.serialize(sessionKey, '', {
		httpOnly: true,
		path: '/',
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		maxAge: 0,
	})

	return cookie
}

export function setSessionTokenCookie(token: string, expiresAt: Date) {
	return cookies.serialize(sessionKey, token, {
		httpOnly: true,
		path: '/',
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		expires: expiresAt,
	})
}

export async function invalidateUserSessions(
	userId: string,
	db: TKyselyDb,
): Promise<void> {
	await db.deleteFrom('session').where('userId', '=', userId).execute()
}

export interface Session {
	id: string
	expiresAt: Date
	userId: string
	organizationId: string
	membershipId: string
}

export interface SessionUser {
	user: {
		name: string
		email: string
	}
	organization: {
		name: string
		id: string
	}
	membership: {
		id: string
	}
}

type SessionValidationResult =
	| { session: Session; user: SessionUser }
	| { session: null; user: null }
