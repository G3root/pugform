import { TRPCError } from '@trpc/server'
import { ResultAsync } from 'neverthrow'
import { withAuthProcedure } from '~/trpc/init'
import { IntegrationRegistry } from '../registry'
import { AddIntegrationSchema } from '../schema'
import { IntegrationService } from '../services'

const integrationService = new IntegrationService(new IntegrationRegistry())

export const AddIntegrationProcedure = withAuthProcedure
	.input(AddIntegrationSchema)
	.mutation(async ({ ctx, input }) => {
		const organizationId = ctx.session.organizationId
		return ResultAsync.fromPromise(
			ctx.db
				.selectFrom('form')
				.where('id', '=', input.formId)
				.where('organizationId', '=', organizationId)
				.select(['id'])
				.executeTakeFirstOrThrow(),
			(error) =>
				new TRPCError({
					code: 'NOT_FOUND',
					message: 'Form not found for the organization',
				}),
		)
			.andThen((form) =>
				integrationService.addIntegration(
					{
						organizationId,
						formId: form.id,
						integrationId: input.integrationId,
						config: input.config,
					},
					ctx.db,
				),
			)
			.map(() => ({
				message: 'integration added successfully',
			}))
			.mapErr(() => {
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'Integration failed',
				})
			})
			.match(
				(success) => success,
				(error) => {
					throw error
				},
			)
	})
