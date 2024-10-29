import type { NewUser, TKyselyDb } from '~/lib/db.server'
import { hashPassword } from '~/utils/password.server'
import { newId } from '~/utils/uuid'

interface createUserOptions {
	email: string
	name: string
	password: string
	additionalProperties?: Partial<
		Omit<NewUser, 'email' | 'name' | 'passwordHash'>
	>
}

export async function createUser(options: createUserOptions, db: TKyselyDb) {
	const passwordHash = await hashPassword(options.password)
	return db
		.insertInto('user')
		.values({
			id: newId('user'),
			passwordHash,
			email: options.email,
			name: options.name,
			...(options.additionalProperties && { ...options.additionalProperties }),
		})
		.returningAll()
		.executeTakeFirstOrThrow()
}
