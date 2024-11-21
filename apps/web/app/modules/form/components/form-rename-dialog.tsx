import type { DialogTriggerProps } from 'react-aria-components'
import { useSubmit } from 'react-router'
import { Button } from '~/components/ui/button'
import { Modal } from '~/components/ui/modal'
import { TextField } from '~/components/ui/text-field'

export const renameFormActionIntent = 'rename-form'

interface FormRenameDialogProps extends Omit<DialogTriggerProps, 'children'> {
	id: string
	defaultValue: string
}

export function FormRenameDialog({
	id,
	defaultValue,
	...props
}: FormRenameDialogProps) {
	const submit = useSubmit()
	return (
		<Modal.Content {...props}>
			<Modal.Header>
				<Modal.Title>Rename Form</Modal.Title>
			</Modal.Header>

			<form
				id="rename-form"
				onSubmit={(e) => {
					e.preventDefault()
					e.stopPropagation()
					const formData = new FormData(e.currentTarget)
					formData.append('formId', id)
					formData.append('intent', renameFormActionIntent)
					submit(formData, {
						method: 'post',
						action: '/resources/rename-form',
						navigate: false,
					})

					if (props.onOpenChange) {
						props?.onOpenChange(false)
					}
				}}
			>
				<TextField
					name="title"
					defaultValue={defaultValue}
					label="Title"
					isRequired
				/>
			</form>

			<Modal.Footer>
				<Button
					form="rename-form"
					type="submit"
					appearance="solid"
					intent="primary"
				>
					Save
				</Button>
			</Modal.Footer>
		</Modal.Content>
	)
}
