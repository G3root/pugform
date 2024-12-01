import { type Integration, type TKyselyDb, db } from '@pugform/database'
import { ResultAsync, err, errAsync, okAsync } from 'neverthrow'
import * as Errors from '~/errors'
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

	processFormSubmission({ formData, context }: ProcessFormSubmissionOptions) {
		return ResultAsync.fromPromise(
			db
				.selectFrom('integration')
				.where('formId', '=', context.formId)
				.select(['id', 'integrationId', 'config', 'formId', 'organizationId'])
				.execute(),
			(error) =>
				err(
					Errors.other(
						'Failed to fetch integrations',
						error instanceof Error ? error : undefined,
					),
				),
		).andThen((integrations) => {
			if (!integrations.length) {
				return okAsync(undefined)
			}

			return ResultAsync.fromPromise(
				Promise.allSettled(
					integrations.map((integration) =>
						this.processIntegration({ integration, context, formData }),
					),
				),
				(error) =>
					err(
						Errors.other(
							'Failed during integration processing',
							error instanceof Error ? error : undefined,
						),
					),
			).map((results) => {
				// Map results into a structured format
				const processedResults: ProcessResult[] = results.map(
					(result, index) => {
						const integration = integrations[index]

						const data = {
							...context,
							integrationId: integration.id,
						}

						if (result.status === 'fulfilled') {
							const value = result.value
							if (value.isOk()) {
								return { ...value.value, ...data, success: true }
							}

							return {
								success: false,
								error: value.error.context,
								...data,
							}
						}

						return {
							success: false,
							error:
								result.reason instanceof Error
									? result.reason.message
									: result.reason,
							...data,
						}
					},
				)
				return this.logResults(processedResults).map(() => processedResults)
			})
		})
	}

	addIntegration(
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
		return ResultAsync.fromPromise(
			Promise.resolve(this.registry.getHandler(integrationId)),
			(error) =>
				err(
					Errors.other(
						'Failed to get handler',
						error instanceof Error ? error : undefined,
					),
				),
		)
			.andThen((handler) =>
				ResultAsync.fromPromise(
					Promise.resolve(handler.parseConfig(config_)),
					(error) =>
						Errors.other(
							'Invalid config',
							error instanceof Error ? error : undefined,
						),
				).andThen((config) =>
					ResultAsync.fromPromise(handler.testConnection(config), (error) =>
						Errors.other(
							'Connection test failed',
							error instanceof Error ? error : undefined,
						),
					).andThen((hasConnection) => {
						if (!hasConnection) {
							return errAsync(Errors.other('Connection test failed'))
						}
						return okAsync({ handler, config })
					}),
				),
			)
			.andThen(({ handler, config }) =>
				ResultAsync.fromPromise(
					trx
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
						.execute(),
					(error) =>
						Errors.other(
							'Failed to insert integration',
							error instanceof Error ? error : undefined,
						),
				),
			)
	}

	private processIntegration({
		integration,
		formData,
		context,
	}: processIntegrationOption) {
		return ResultAsync.fromPromise(
			Promise.resolve(
				this.registry.getHandler(integration.integrationId as TIntegrationIds),
			),
			(error) =>
				Errors.other(
					'Failed to get handler',
					error instanceof Error ? error : undefined,
				),
		).andThen((handler) =>
			ResultAsync.fromPromise(
				Promise.resolve(handler.parseConfig(integration.config)),
				(error) =>
					Errors.other(
						'Invalid config',
						error instanceof Error ? error : undefined,
					),
			).andThen((config) =>
				ResultAsync.fromPromise(
					handler.process({
						formData,
						config,
						context,
						integrationId: integration.id,
					}),
					(error) =>
						Errors.other(
							'Processing failed',
							error instanceof Error ? error : undefined,
						),
				),
			),
		)
	}

	private logResults(results: ProcessResult[]) {
		return ResultAsync.fromPromise(
			db
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
						errorMessage: data?.error,
					})),
				)
				.execute(),
			(error) =>
				err(
					Errors.other(
						'Failed to log integration Log',
						error instanceof Error ? error : undefined,
					),
				),
		)
	}
}
