import type { NewMembership, NewOrganization, TKyselyDb } from '~/lib/db.server'
import { newId } from '~/utils/uuid'

export async function createOrganization(
	db: TKyselyDb,
	organizationOptions: Omit<NewOrganization, 'id'> & { userId: string },
	membershipOptions?: Partial<
		Omit<NewMembership, 'id' | 'organizationId' | 'userId'>
	>,
) {
	const { userId, ...rest } = organizationOptions
	const organization = await db
		.insertInto('organization')
		.values({
			id: newId('organization'),
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
			...(membershipOptions && { ...membershipOptions }),
		})
		.returning(['id'])
		.executeTakeFirstOrThrow()

	return { organization, membership }
}
