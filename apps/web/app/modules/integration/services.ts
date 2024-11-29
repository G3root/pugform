import { type Integration, type TKyselyDb, db } from '@pugform/database'
import { newId } from '~/utils/uuid'
import type { IntegrationRegistry } from './registry'
import type { TIntegrationIds } from './schema'
import type {
	IntegrationFormData,
	IntegrationHandlerContext,
	ProcessResult,
} from './types'

interface ProcessFormSubmissionOptions {
	context: IntegrationHandlerContext
	formData: IntegrationFormData
}

interface processIntegrationOption extends ProcessFormSubmissionOptions {
	integration: Pick<Integration, 'id' | 'integrationId' | 'config'>
}

export class IntegrationService {
	constructor(private registry: IntegrationRegistry) {}

	async processFormSubmission({
		formData,
		context,
	}: ProcessFormSubmissionOptions) {
		try {
			const integrations = await db
				.selectFrom('integration')
				.where('formId', '=', context.formId)
				.select(['id', 'integrationId', 'config', 'formId', 'organizationId'])
				.execute()

			if (!integrations.length) {
				return
			}

			const results = await Promise.allSettled(
				integrations.map((integration) =>
					this.processIntegration({ integration, context, formData }),
				),
			)

			const processedResults: ProcessResult[] = results.map((result, index) => {
				const integration = integrations[index]

				const data = {
					...context,
					integrationId: integration.id,
				}

				if (result.status === 'fulfilled') {
					return {
						...result.value,
						...data,
					}
				}
				return {
					success: false,
					error: result.reason,
					...data,
				}
			})
			await this.logResults(processedResults)
			return processedResults
		} catch (error) {
			console.error('Integration processing error:', error)
			throw error
		}
	}

	async addIntegration(
		{
			formId,
			organizationId,
			integrationId,
			config: config_,
		}: {
			formId: string
			organizationId: string
			integrationId: TIntegrationIds
			config: unknown
		},
		trx: TKyselyDb,
	) {
		const handler = this.registry.getHandler(integrationId)
		const config = handler.parseConfig(config_)

		const hasConnection = await handler.testConnection(config)
		if (!hasConnection) {
			throw new Error('Failed to connect to integration')
		}

		await trx
			.insertInto('integration')
			.values({
				id: newId('integration'),
				enabled: true,
				formId,
				organizationId,
				integrationId,
				config,
				updatedAt: new Date(),
				createdAt: new Date(),
			})
			.execute()
	}

	private async processIntegration({
		integration,
		formData,
		context,
	}: processIntegrationOption) {
		const handler = this.registry.getHandler(
			integration.integrationId as TIntegrationIds,
		)

		try {
			const config = handler.parseConfig(integration.config)

			const result = await handler.process({
				formData,
				config,
				context,
				integrationId: integration.id,
			})

			return result
		} catch (error) {
			// if (this.shouldRetry(error)) {
			// 	return this.retryProcessing(integration, options)
			// }
			// biome-ignore lint/complexity/noUselessCatch: <explanation>
			throw error
		}
	}

	private async logResults(results: ProcessResult[]): Promise<void> {
		await db
			.insertInto('integrationLog')
			.values(
				results.map((data) => ({
					timeStamp: new Date(),
					id: newId('integrationLog'),
					formId: data.formId,
					integrationId: data.integrationId,
					organizationId: data.organizationId,
					responseId: data.responseId,
					success: data.success,
					metadata: data.metadata,
					errorMessage: data.error?.message,
				})),
			)
			.execute()
	}
}
