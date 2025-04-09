import { type TKyselyDb, jsonArrayFrom } from '@pugform/database'
import { TRPCError } from '@trpc/server'
import { fromPromise } from 'neverthrow'
import * as Errors from '~/utils/errors'
import { protectedProcedure } from '../../trpc'

export const allProjectProcedure = protectedProcedure.query(async ({ ctx }) => {
	return allProjects({
		db: ctx.db,
		data: {
			memberId: ctx.session.session.activeMemberId,
			organizationId: ctx.session.session.activeOrganizationId,
		},
	})
		.mapErr(Errors.mapRouteError)
		.match(
			(projects) => {
				return projects
			},
			(error) => {
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: error.errorMsg,
				})
			},
		)
})

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
			.selectFrom('project as p')
			.where('organizationId', '=', data.organizationId)
			.select((eb) => [
				jsonArrayFrom(
					eb
						.selectFrom('form as f')
						.select(['f.name', 'f.id', 'f.publicId'])
						.orderBy('createdAt', 'desc')
						.whereRef('f.projectId', '=', 'p.id'),
				).as('forms'),
			])
			.selectAll()
			.orderBy('createdAt', 'desc')
			.execute(),
		(e) => Errors.other('Failed to get all projects', e as Error),
	)
}
