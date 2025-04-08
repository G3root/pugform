import type { TKyselyDb } from '@pugform/database'
import { TRPCError } from '@trpc/server'
import { fromPromise } from 'neverthrow'
import * as Errors from '~/utils/errors'
import { newPublicId } from '~/utils/uuid'
import { newId } from '~/utils/uuid'
import { protectedProcedure } from '../../trpc'
import { CreateProjectSchema } from '../schema'

export const createProjectProcedure = protectedProcedure
	.input(CreateProjectSchema)
	.mutation(async ({ ctx, input }) => {
		return createProject({
			db: ctx.db,
			data: {
				memberId: ctx.session.session.activeMemberId,
				organizationId: ctx.session.session.activeOrganizationId,
				name: input.name,
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
