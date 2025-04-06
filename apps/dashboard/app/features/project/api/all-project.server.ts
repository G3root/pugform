import type { TKyselyDb } from '@pugform/database'
import { fromPromise } from 'neverthrow'
import * as Errors from '~/utils/errors'

interface TAllProjectsOptions {
	db: TKyselyDb
	data: {
		memberId: string
		organizationId: string
	}
}

export function allProjects({ db, data }: TAllProjectsOptions) {
	return fromPromise(
		db
			.selectFrom('project')
			.where('organizationId', '=', data.organizationId)
			.selectAll()
			.execute(),
		(e) => Errors.other('Failed to get all projects', e as Error),
	)
}
