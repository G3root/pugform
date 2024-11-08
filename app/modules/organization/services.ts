import type { NewMembership, NewOrganization, TKyselyDb } from '~/lib/db.server'
import { newId } from '~/utils/uuid'

export async function createOrganization(
	db: TKyselyDb,
	organizationOptions: Omit<
		NewOrganization,
		'id' | 'createdAt' | 'updatedAt'
	> & {
		userId: string
	},
	membershipOptions?: Partial<
		Omit<
			NewMembership,
			| 'id'
			| 'organizationId'
			| 'userId'
			| 'createdAt'
			| 'lastAccessed'
			| 'updatedAt'
		>
	>,
) {
	const { userId, ...rest } = organizationOptions
	const organization = await db
		.insertInto('organization')
		.values({
			id: newId('organization'),
			createdAt: new Date(),
			updatedAt: new Date(),
			...rest,
		})

		.returning(['id'])
		.executeTakeFirstOrThrow()

	const membership = await db
		.insertInto('membership')
		.values({
			organizationId: organization.id,
			userId,
			id: newId('member'),
			lastAccessed: new Date(),
			createdAt: new Date(),
			updatedAt: new Date(),
			...(membershipOptions && { ...membershipOptions }),
		})
		.returning(['id'])
		.executeTakeFirstOrThrow()

	return { organization, membership }
}
