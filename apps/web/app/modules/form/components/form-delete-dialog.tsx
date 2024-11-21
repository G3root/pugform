import type { DialogTriggerProps } from 'react-aria-components'
import { useSubmit } from 'react-router'
import { Modal } from '~/components/ui/modal'

interface FormDeleteDialogProps extends Omit<DialogTriggerProps, 'children'> {
	id: string
	redirectTo?: string
}

export const deleteFormActionIntent = 'delete-form'

export function FormDeleteDialog({
	id,
	redirectTo,
	...rest
}: FormDeleteDialogProps) {
	const submit = useSubmit()

	return (
		<Modal.Content {...rest} role="alertdialog">
			<Modal.Header>
				<Modal.Title>Delete Form</Modal.Title>
				<Modal.Description>
					This will permanently delete the form and form responses within it.
				</Modal.Description>
			</Modal.Header>

			<Modal.Footer>
				<Modal.Close appearance="outline">Cancel</Modal.Close>
				<Modal.Close
					onPress={() => {
						const formData = new FormData()
						formData.append('formId', id)
						if (redirectTo) {
							formData.append('redirectTo', redirectTo)
						}
						submit(formData, {
							method: 'post',
							action: '/resources/delete-form',
							navigate: false,
						})
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
