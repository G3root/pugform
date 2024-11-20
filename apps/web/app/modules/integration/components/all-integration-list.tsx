import { useLoaderData } from 'react-router'
import { Card } from '~/components/ui/card'
import { Heading } from '~/components/ui/heading'
import { Stack } from '~/components/ui/stack'
import { AddIntegrationModal } from './add-integration-modal'
import type { Route } from '.react-router/types/app/routes/(application)/(dashboard)/forms/+types.form-integrations'

export function AllIntegrationList() {
	const loaderData = useLoaderData<Route.LoaderData>()
	return (
		<Stack>
			<div>
				<Heading level={3}>All Integrations</Heading>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-3">
				{loaderData.allIntegrations.map((integration) => (
					<Card key={integration.id}>
						<Card.Header>
							<Card.Title>{integration.name}</Card.Title>
							<Card.Description>{integration.description}</Card.Description>
						</Card.Header>
						<Card.Footer>
							<AddIntegrationModal
								id={integration.id}
								name={integration.name}
							/>
						</Card.Footer>
					</Card>
				))}
			</div>
		</Stack>
	)
}
