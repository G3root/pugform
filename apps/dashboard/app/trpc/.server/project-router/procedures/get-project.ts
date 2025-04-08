import type { TKyselyDb } from '@pugform/database'
import { fromPromise } from 'neverthrow'
import { z } from 'zod'
import * as Errors from '~/utils/errors'
import { protectedProcedure } from '../../trpc'

export const getProjectProcedure = protectedProcedure
	.input(
		z.object({
			publicId: z.string(),
		}),
	)
	.query(async ({ ctx, input }) => {
		return getProject({
			db: ctx.db,
			data: {
				publicId: input.publicId,
				organizationId: ctx.session.session.activeOrganizationId,
			},
		})
	})

export function getProject({
	db,
	data,
}: {
	db: TKyselyDb
	data: {
		publicId: string
		organizationId: string
	}
}) {
	return fromPromise(
		db
			.selectFrom('project')
			.where('publicId', '=', data.publicId)
			.where('organizationId', '=', data.organizationId)
			.selectAll()
			.executeTakeFirstOrThrow(),
		(e) => Errors.other('Failed to get project', e as Error),
	)
}
