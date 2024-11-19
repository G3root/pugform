import { Button } from '~/components/ui/button'
import { Modal } from '~/components/ui/modal'
import type { TIntegrationIds } from '../schema'
import { WebHookForm } from './integration-forms/webhook-form'

interface AddIntegrationModalProp {
	id: TIntegrationIds
	name: string
}

const formMap: Record<TIntegrationIds, typeof WebHookForm> = {
	webhook: WebHookForm,
}

export function AddIntegrationModal({ name, id }: AddIntegrationModalProp) {
	const Component = formMap?.[id] ?? null
	return (
		<Modal>
			<Button size="extra-small">connect</Button>
			<Modal.Content>
				<Modal.Header>
					<Modal.Title>Connect with {name}</Modal.Title>
					<Modal.Description>...</Modal.Description>
				</Modal.Header>
				<Component id={id} />
			</Modal.Content>
		</Modal>
	)
}
