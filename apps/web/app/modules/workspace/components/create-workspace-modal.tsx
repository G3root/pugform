import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { Form, useActionData, useNavigation } from 'react-router';
import { IconPlus } from 'justd-icons'
import { useContext, useEffect, useRef } from 'react'
import { OverlayTriggerStateContext } from 'react-aria-components'
import { Button } from '~/components/ui/button'
import { Modal } from '~/components/ui/modal'
import { TextField } from '~/components/ui/text-field'
import {
	type TCreateWorkspaceAction,
	workspaceCreateActionIntent,
} from '~/routes/(application)/(dashboard)/workspace/all-workspaces'
import { CreateWorkspaceSchema } from '../schema'

export function CreateWorkspaceModal() {
	const actionData = useActionData<TCreateWorkspaceAction>()

	const [form, fields] = useForm({
		id: 'workspace-form',
		constraint: getZodConstraint(CreateWorkspaceSchema),

		lastResult: actionData?.result,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: CreateWorkspaceSchema })
		},
		shouldRevalidate: 'onBlur',
	})

	return (
		<Modal>
			<Button>
				<IconPlus /> New Workspace
			</Button>
			<Modal.Content>
				<Modal.Header>
					<Modal.Title>Create a workspace</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form method="POST" {...getFormProps(form)}>
						<TextField
							label="Name"
							{...getInputProps(fields.name, { type: 'text' })}
							errors={fields.name.errors}
						/>
					</Form>
					{/* <CloseForm /> */}
				</Modal.Body>
				<Modal.Footer className="justify-end">
					<Button
						name="intent"
						value={workspaceCreateActionIntent}
						form={form.id}
						type="submit"
					>
						Save
					</Button>
				</Modal.Footer>
			</Modal.Content>
		</Modal>
	)
}

// function CloseForm() {
// 	const navigation = useNavigation()
// 	const actionData = useActionData<TCreateWorkspaceAction>()
// 	// biome-ignore lint/style/noNonNullAssertion: <explanation>
// 	const state = useContext(OverlayTriggerStateContext)!
// 	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
// 	useEffect(
// 		function resetFormOnSuccess() {
// 			if (navigation.state === 'idle' && actionData?.status === 'success') {
// 				state.close()
// 			}
// 		},
// 		[navigation.state],
// 	)

// 	return null
// }
