import type { TKyselyDb } from '@pugform/database'
import { fromPromise } from 'neverthrow'
import * as Errors from '~/utils/errors'
import { newPublicId } from '~/utils/uuid'
import { newId } from '~/utils/uuid'

type TCreateProjectOptions = {
	data: {
		name: string
		organizationId: string
		memberId: string
	}
	db: TKyselyDb
}
export function createProject({ data, db }: TCreateProjectOptions) {
	return fromPromise(
		db
			.insertInto('project')
			.values({
				creatorId: data.memberId,
				organizationId: data.organizationId,
				publicId: newPublicId(),
				id: newId('project'),
				name: data.name,
				createdAt: new Date(),
				updatedAt: new Date(),
			})
			.returningAll()
			.executeTakeFirstOrThrow(),
		(e) => Errors.other('Failed to create project', e as Error),
	)
}
