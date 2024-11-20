import { IconTrash } from 'justd-icons'
import { useState } from 'react'
import type { DialogTriggerProps } from 'react-aria-components'
import { useLoaderData, useParams, useSubmit } from 'react-router'
import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { Heading } from '~/components/ui/heading'
import { Modal } from '~/components/ui/modal'
import { Stack } from '~/components/ui/stack'
import { deleteIntegrationIntent } from '~/routes/(application)/(dashboard)/forms/form-integrations'
import type { TWebhookConfig } from '../integrations/_schema'
import type { TIntegrationIds } from '../schema'
import type {
	Params,
	Route,
} from '.react-router/types/app/routes/(application)/(dashboard)/forms/+types.form-integrations'

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const integrationDescriptionMap: Record<TIntegrationIds, (val: any) => string> =
	{
		webhook: (config: TWebhookConfig) => config.webhookUrl,
	}

export function ActiveIntegrationList() {
	const loaderData = useLoaderData<Route.LoaderData>()

	const [open, setOpen] = useState(false)
	const [id, setId] = useState('')
	return (
		<Stack>
			<div>
				<Heading level={3}>Connected Integrations</Heading>
			</div>
			<Stack>
				{loaderData.connectedIntegrations.map((integration) => (
					<Stack
						direction="row"
						justify="between"
						align="center"
						key={integration.id}
					>
						<Stack gap={2}>
							<Card.Title>{integration.metadata.name}</Card.Title>

							<Card.Description>
								{integrationDescriptionMap[
									integration.integrationId as TIntegrationIds
								](integration.config)}
							</Card.Description>
						</Stack>

						<Stack>
							<Button
								onPress={() => {
									setOpen(true)
									setId(integration.id)
								}}
								size="square-petite"
								appearance="outline"
							>
								<IconTrash />
							</Button>
						</Stack>
					</Stack>
				))}
			</Stack>
			<RemoveIntegrationDialog id={id} isOpen={open} onOpenChange={setOpen} />
		</Stack>
	)
}

interface RemoveIntegrationDialogProps
	extends Omit<DialogTriggerProps, 'children'> {
	id: string
}

function RemoveIntegrationDialog({
	id,
	...rest
}: RemoveIntegrationDialogProps) {
	const submit = useSubmit()
	const { formId } = useParams<Params>()
	return (
		<Modal.Content {...rest} role="alertdialog">
			<Modal.Header>
				<Modal.Title>Delete Integration</Modal.Title>
				<Modal.Description>
					are you sure you want to delete this integration?
				</Modal.Description>
			</Modal.Header>

			<Modal.Footer>
				<Modal.Close appearance="outline">Cancel</Modal.Close>
				<Modal.Close
					onPress={() => {
						const formData = new FormData()
						formData.append('id', id)
						formData.append('intent', deleteIntegrationIntent)
						formData.append('formId', formId ?? '')
						submit(formData, { method: 'post' })
					}}
					appearance="solid"
					intent="danger"
				>
					Continue
				</Modal.Close>
			</Modal.Footer>
		</Modal.Content>
	)
}
