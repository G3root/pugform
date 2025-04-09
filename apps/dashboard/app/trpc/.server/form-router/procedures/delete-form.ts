import type { TKyselyDb } from '@pugform/database'
import { TRPCError } from '@trpc/server'
import { fromPromise } from 'neverthrow'
import * as Errors from '~/utils/errors'
import { protectedProcedure } from '../../trpc'
import { DeleteFormSchema } from '../schema'

export const deleteFormProcedure = protectedProcedure
	.input(DeleteFormSchema)
	.mutation(async ({ ctx, input }) => {
		return deleteForm({
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

type TDeleteFormOptions = {
	data: {
		formPublicId: string
		organizationId: string
	}
	db: TKyselyDb
}
export function deleteForm({ data, db }: TDeleteFormOptions) {
	return fromPromise(
		db
			.deleteFrom('form')
			.where('publicId', '=', data.formPublicId)
			.where('organizationId', '=', data.organizationId)
			.executeTakeFirstOrThrow(),
		(e) => Errors.other('Failed to delete form', e as Error),
	)
}
