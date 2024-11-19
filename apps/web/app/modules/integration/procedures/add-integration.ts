import { withAuthProcedure } from '~/trpc/init'
import { IntegrationRegistry } from '../registry'
import { AddIntegrationSchema } from '../schema'
import { IntegrationService } from '../services'

const integrationService = new IntegrationService(new IntegrationRegistry())

export const AddIntegrationProcedure = withAuthProcedure
	.input(AddIntegrationSchema)
	.mutation(async ({ ctx, input }) => {
		const organizationId = ctx.session.organizationId

		const form = await ctx.db
			.selectFrom('form')
			.where('id', '=', input.formId)
			.where('organizationId', '=', organizationId)
			.select(['id'])
			.executeTakeFirstOrThrow()

		await integrationService.addIntegration(
			{
				organizationId,
				formId: form.id,
				integrationId: input.integrationId,
				config: input.config,
			},
			ctx.db,
		)

		return {}
	})
