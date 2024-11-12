import { withAuthProcedure } from '~/trpc/init'
import { GetFormSchema } from '../schema'

export const deleteFormProcedure = withAuthProcedure
	.input(GetFormSchema)
	.query(async ({ ctx, input }) => {
		const organizationId = ctx.session.organizationId

		await ctx.db.transaction().execute(async (trx) => {
			await trx
				.deleteFrom('formPage')
				.where('organizationId', '=', organizationId)
				.where('formId', '=', input.formId)
				.execute()

			await trx
				.deleteFrom('form')
				.where('organizationId', '=', organizationId)
				.where('id', '=', input.formId)
				.execute()
		})

		return {
			message: 'form deleted successfully',
		}
	})
