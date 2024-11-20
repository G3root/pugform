import { parseWithZod } from '@conform-to/zod'
import { type AppLoadContext, data } from 'react-router'
import { Stack } from '~/components/ui/stack'
import { ActiveIntegrationList } from '~/modules/integration/components/active-integration-list'
import { AllIntegrationList } from '~/modules/integration/components/all-integration-list'
import { IntegrationRegistry } from '~/modules/integration/registry'
import {
	DeleteIntegrationSchema,
	IntegrationIdsSchema,
} from '~/modules/integration/schema'
import { trpcServer } from '~/trpc/server'
import { requireAuth } from '~/utils/auth.server'
import { createToastHeaders } from '~/utils/toast.server'
import type { Route } from './+types.form-integrations'

const registry = new IntegrationRegistry()
const allIntegrations = registry.getAllMetadata()

export const addIntegrationIntent = 'add-integration'
export const deleteIntegrationIntent = 'delete-integration'

export async function loader({
	context: context_,
	params,
	request,
}: Route.LoaderArgs) {
	const context = context_ as AppLoadContext

	requireAuth(context)

	const { data: connectedIntegrations } = await trpcServer({
		context,
		request,
	}).integration.all({
		formId: params.formId,
	})

	return {
		allIntegrations,
		connectedIntegrations,
	}
}

export async function action({
	request,
	context: context_,
	params,
}: Route.ActionArgs) {
	const context = context_ as AppLoadContext
	requireAuth(context)
	const formData = await request.formData()

	const intent = formData.get('intent')

	switch (intent) {
		case addIntegrationIntent:
			return addIntegrationFormAction({ context, formData, params, request })

		case deleteIntegrationIntent:
			return deleteIntegrationFormAction({ context, formData, params, request })

		default: {
			throw new Response(`Invalid intent "${intent}"`, { status: 400 })
		}
	}
}

type TActionArgs = Route.ActionArgs & {
	formData: FormData
	context: AppLoadContext
}

async function addIntegrationFormAction({
	formData,
	context,
	request,
	params,
}: TActionArgs) {
	const integrationId = IntegrationIdsSchema.parse(
		formData.get('integrationId'),
	)

	const submission = parseWithZod(formData, {
		schema: registry.getHandler(integrationId).configSchema,
	})

	if (submission.status !== 'success') {
		return data(
			{ result: submission.reply() },
			{ status: submission.status === 'error' ? 400 : 200 },
		)
	}

	const config = submission.value

	const { message } = await trpcServer({ context, request }).integration.add({
		config,
		formId: params.formId,
		integrationId,
	})

	return data(
		{
			result: submission.reply(),
			status: 'success' as const,
		},
		{
			status: 200,
			headers: await createToastHeaders({
				type: 'success',
				description: message,
			}),
		},
	)
}

async function deleteIntegrationFormAction({
	formData,
	context,
	request,
}: TActionArgs) {
	const submission = parseWithZod(formData, {
		schema: DeleteIntegrationSchema,
	})

	if (submission.status !== 'success') {
		return data(
			{ result: submission.reply() },
			{ status: submission.status === 'error' ? 400 : 200 },
		)
	}

	const { message } = await trpcServer({ context, request }).integration.delete(
		submission.value,
	)
	return data(
		{
			result: submission.reply(),
			status: 'success' as const,
		},
		{
			status: 200,
			headers: await createToastHeaders({
				type: 'success',
				description: message,
			}),
		},
	)
}

export default function FormIntegrationsPage({
	loaderData,
	params,
}: Route.ComponentProps) {
	return (
		<Stack>
			<ActiveIntegrationList />
			<AllIntegrationList />
		</Stack>
	)
}
