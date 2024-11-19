import { parseWithZod } from '@conform-to/zod'
import { type AppLoadContext, data } from 'react-router'
import { Card } from '~/components/ui/card'
import { AddIntegrationModal } from '~/modules/integration/components/add-integration-modal'
import { IntegrationRegistry } from '~/modules/integration/registry'
import { IntegrationIdsSchema } from '~/modules/integration/schema'
import { trpcServer } from '~/trpc/server'
import { requireAuth } from '~/utils/auth.server'
import { createToastHeaders } from '~/utils/toast.server'
import type { Route } from './+types.form-integrations'

const registry = new IntegrationRegistry()
const allIntegrations = registry.getAllMetadata()

export async function loader({ context, params }: Route.LoaderArgs) {
	requireAuth(context as AppLoadContext)

	return {
		allIntegrations,
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

	const integrationId = IntegrationIdsSchema.parse(
		formData.get('integrationId'),
	)
	console.log({ integrationId })

	const submission = parseWithZod(formData, {
		schema: registry.getHandler(integrationId).configSchema,
	})

	console.log({ submission })

	if (submission.status !== 'success') {
		return data(
			{ result: submission.reply() },
			{ status: submission.status === 'error' ? 400 : 200 },
		)
	}

	const config = submission.value

	console.log({
		config,
		formId: params.formId,
		integrationId,
	})

	await trpcServer({ context, request }).integration.add({
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
				description: 'integration added successfully',
			}),
		},
	)
}

export default function FormIntegrationsPage({
	loaderData,
	params,
}: Route.ComponentProps) {
	return (
		<div className="grid grid-cols-3">
			{loaderData.allIntegrations.map((integration) => (
				<Card key={integration.id}>
					<Card.Header>
						<Card.Title>{integration.name}</Card.Title>
						<Card.Description>{integration.description}</Card.Description>
					</Card.Header>
					<Card.Footer>
						<AddIntegrationModal id={integration.id} name={integration.name} />
					</Card.Footer>
				</Card>
			))}
		</div>
	)
}
