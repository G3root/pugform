import { db } from '~/lib/db.server'
import { withAuthProcedure } from '~/trpc/init'
import { RenameFormSchema } from '../schema'

export const renameFormProcedure = withAuthProcedure
	.input(RenameFormSchema)
	.query(async ({ ctx, input }) => {
		const organizationId = ctx.session.organizationId

		await db
			.updateTable('form')
			.where('organizationId', '=', organizationId)
			.where('id', '=', input.formId)
			.set({
				title: input.title,
				updatedAt: new Date(),
			})
			.execute()

		return {
			message: 'form updated successfully',
		}
	})
