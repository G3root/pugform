import { db } from '~/lib/db.server'
import { withAuthProcedure } from '~/trpc/init'
import { GetFormSchema } from '../schema'

export const deleteFormProcedure = withAuthProcedure
	.input(GetFormSchema)
	.query(async ({ ctx, input }) => {
		const organizationId = ctx.session.organizationId

		await db
			.deleteFrom('form')
			.where('organizationId', '=', organizationId)
			.where('id', '=', input.formId)
			.execute()

		return {
			message: 'form deleted successfully',
		}
	})
