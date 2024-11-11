import { decodeBase64, encodeBase64 } from '@oslojs/encoding'
import { generateTOTP, verifyTOTP } from '@oslojs/otp'
import { createCookieSessionStorage, json } from '@remix-run/node'
import type { Verification } from '~/generated/db-types'
import { type TKyselyDb, db } from '~/lib/db.server'
import { TimeSpan, createDate, isWithinExpirationDate } from './date'
import { getDomainUrl } from './url'
import { newId } from './uuid'

export type TVerificationType = Verification['type']

const DEFAULT_PERIOD = 15
const DEFAULT_OTP_TIME_SPAN = new TimeSpan(DEFAULT_PERIOD, 'm')
const DEFAULT_DIGITS = 6

export function getRedirectToUrl({
	request,
	redirectTo,
	urlPath,
}: {
	request: Request
	type: TVerificationType
	redirectTo?: string
	urlPath: string
}) {
	const redirectToUrl = new URL(`${getDomainUrl(request)}${urlPath}`)

	if (redirectTo) {
		redirectToUrl.searchParams.set('redirectTo', redirectTo)
	}
	return redirectToUrl
}

type OtpResults = 'valid' | 'invalid' | 'expired'

export async function isCodeValid({
	code,
	type,
	target,
}: {
	code: string
	type: TVerificationType
	target: string
}): Promise<OtpResults> {
	return db.transaction().execute(async (trx) => {
		console.log({ code, type, target })
		const token = await trx
			.selectFrom('verification')
			.where('target', '=', target)
			.where('type', '=', type)
			.select(['secret', 'expiresAt', 'id', 'period', 'digits'])
			.executeTakeFirst()

		console.log({ token })

		if (!token) {
			return 'invalid'
		}

		if (token.expiresAt && !isWithinExpirationDate(token.expiresAt)) {
			await deleteVerification({ id: token.id }, trx)
			return 'expired'
		}

		const verified = verifyTOTP(
			decodeBase64(token.secret),
			token.period,
			token.digits,
			code,
		)

		return verified ? 'valid' : 'invalid'
	})
}

export async function prepareVerification(
	{
		digits = DEFAULT_DIGITS,
		request,
		type,
		target,
		verifyUrlPath,
		valid = DEFAULT_OTP_TIME_SPAN,
	}: {
		request: Request
		type: TVerificationType
		target: string
		verifyUrlPath: string
		valid?: TimeSpan
		digits?: number
	},
	tx: TKyselyDb,
) {
	const verifyUrl = getRedirectToUrl({ request, type, urlPath: verifyUrlPath })
	const redirectTo = new URL(verifyUrl.toString())

	const totpKey = new Uint8Array(20)
	crypto.getRandomValues(totpKey)
	const secret = encodeBase64(totpKey)

	const period = valid.seconds()
	const otp = generateTOTP(totpKey, period, digits)
	const expiresAt = createDate(valid)

	const existingToken = await tx
		.selectFrom('verification')
		.where('target', '=', target)
		.where('type', '=', type)
		.executeTakeFirst()

	if (existingToken) {
		await tx
			.updateTable('verification')
			.where('target', '=', target)
			.where('type', '=', type)
			.set({
				secret,
				period,
				digits,
			})
			.executeTakeFirstOrThrow()
	}
	if (!existingToken) {
		await tx
			.insertInto('verification')
			.values({
				id: newId('verification'),
				type,
				target,
				secret,
				period,
				digits,
				expiresAt,
				createdAt: new Date(),
			})

			.executeTakeFirstOrThrow()
	}

	verifyUrl.searchParams.set('code', otp)

	return { otp, redirectTo, verifyUrl }
}

export const verifySessionStorage = createCookieSessionStorage<{
	type: TVerificationType
	target: string
}>({
	cookie: {
		name: 'en_verification',
		sameSite: 'lax', // CSRF protection is advised if changing to 'none'
		path: '/',
		httpOnly: true,
		maxAge: 60 * DEFAULT_PERIOD,
		secrets: process.env.SESSION_SECRET.split(','),
		secure: process.env.NODE_ENV === 'production',
	},
})

type deleteVerificationParams =
	| { type: TVerificationType; target: string; id?: never }
	| { id: string; type?: never; target?: never }

export async function deleteVerification(
	params: deleteVerificationParams,
	tx: TKyselyDb,
) {
	const baseQuery = tx.deleteFrom('verification')

	if (params.id) {
		baseQuery.where('id', '=', params.id)
	}
	if (params.target && params.type) {
		baseQuery
			.where('target', '=', params.target)
			.where('type', '=', params.type)
	}

	await baseQuery.execute()
}
