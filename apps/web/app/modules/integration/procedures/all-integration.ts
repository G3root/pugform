import { withAuthProcedure } from '~/trpc/init'
import { IntegrationRegistry } from '../registry'
import { AllIntegrationSchema } from '../schema'
import { IntegrationService } from '../services'

const registry = new IntegrationRegistry()
const integrationService = new IntegrationService(new IntegrationRegistry())

export const AllIntegrationProcedure = withAuthProcedure
	.input(AllIntegrationSchema)
	.query(async ({ ctx, input }) => {
		const organizationId = ctx.session.organizationId

		const integrations = await ctx.db
			.selectFrom('integration')
			.where('organizationId', '=', organizationId)
			.where('formId', '=', input.formId)
			.select(['id', 'enabled', 'integrationId', 'config'])
			.execute()

		const data = integrations.map((data) => ({
			...data,
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			metadata: registry.getMetadata(data.integrationId as any),
		}))

		return { data }
	})
