import type { TKyselyDb } from '@pugform/database'
import { TRPCError } from '@trpc/server'
import { fromPromise } from 'neverthrow'
import * as Errors from '~/utils/errors'
import { protectedProcedure } from '../../trpc'
import { GetFormSchema } from '../schema'

export const getFormProcedure = protectedProcedure
	.input(GetFormSchema)
	.mutation(async ({ ctx, input }) => {
		return getForm({
			db: ctx.db,
			data: {
				formPublicId: input.formPublicId,
				organizationId: ctx.session.session.activeOrganizationId,
			},
		})
			.mapErr(Errors.mapRouteError)
			.match(
				(form) => {
					return form
				},
				(error) => {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: error.errorMsg,
					})
				},
			)
	})

type TGetFormOptions = {
	data: {
		formPublicId: string
		organizationId: string
	}
	db: TKyselyDb
}
export function getForm({ data, db }: TGetFormOptions) {
	return fromPromise(
		db
			.selectFrom('form')
			.where('publicId', '=', data.formPublicId)
			.where('organizationId', '=', data.organizationId)
			.selectAll()
			.executeTakeFirstOrThrow(),
		(e) => Errors.other('Failed to get form', e as Error),
	)
}
