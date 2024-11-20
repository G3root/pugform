import { withAuthProcedure } from '~/trpc/init'
import { DeleteIntegrationSchema } from '../schema'

export const DeleteIntegrationProcedure = withAuthProcedure
	.input(DeleteIntegrationSchema)
	.mutation(async ({ ctx, input }) => {
		const organizationId = ctx.session.organizationId

		await ctx.db.transaction().execute(async (trx) => {
			const integration = await trx
				.selectFrom('integration')
				.where('id', '=', input.id)
				.where('formId', '=', input.formId)
				.where('organizationId', '=', organizationId)
				.select(['id'])
				.executeTakeFirstOrThrow()

			await trx
				.deleteFrom('integrationLog')
				.where('integrationId', '=', integration.id)
				.executeTakeFirstOrThrow()

			await trx
				.deleteFrom('integration')
				.where('id', '=', integration.id)
				.executeTakeFirstOrThrow()
		})

		return {
			message: 'integration deleted successfully',
		}
	})
