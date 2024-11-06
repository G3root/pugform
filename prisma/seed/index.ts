import 'dotenv/config'
import { randCompanyName, randFullName } from '@ngneat/falso'
import { db } from '~/lib/db.server'
import { createOrganization } from '~/modules/organization/services'
import { createUser } from '~/modules/user/services'

const main = async () => {
	console.log('Seeding database')

	const user1 = await createUser(
		{
			email: 'user1@example.com',
			password: 'P@ssw0rd!',
			name: randFullName(),
			additionalProperties: {
				emailVerified: true,
			},
		},
		db,
	)

	console.log(`👤 Created '${user1.name}' with email "${user1.email}"`)

	await createOrganization(db, { name: randCompanyName(), userId: user1.id })

	process.exit(0)
}
main()
