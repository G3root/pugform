import type { NewUser, TKyselyDb } from '@pugform/database'
import {
	encryptString,
	generateRandomRecoveryCode,
} from '~/utils/crypto.server'
import { hashPassword } from '~/utils/password.server'
import { newId } from '~/utils/uuid'

interface createUserOptions {
	email: string
	name: string
	password: string
	additionalProperties?: Partial<
		Omit<
			NewUser,
			| 'email'
			| 'name'
			| 'passwordHash'
			| 'recoveryCode'
			| 'createdAt'
			| 'updatedAt'
		>
	>
}

export async function createUser(options: createUserOptions, db: TKyselyDb) {
	const passwordHash = await hashPassword(options.password)

	const recoveryCode = generateRandomRecoveryCode()
	const encryptedRecoveryCode = encryptString(recoveryCode)

	return db
		.insertInto('user')
		.values({
			id: newId('user'),
			passwordHash,
			email: options.email,
			name: options.name,
			recoveryCode: Buffer.from(encryptedRecoveryCode),
			createdAt: new Date(),
			updatedAt: new Date(),
			...(options.additionalProperties && { ...options.additionalProperties }),
		})
		.returningAll()
		.executeTakeFirstOrThrow()
}
