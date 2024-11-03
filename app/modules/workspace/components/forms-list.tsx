import { useLoaderData, useSubmit } from '@remix-run/react'
import { IconDotsVertical } from 'justd-icons'
import { useState } from 'react'
import type { DialogTriggerProps } from 'react-aria-components'
import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { Menu } from '~/components/ui/menu'
import { Modal } from '~/components/ui/modal'
import { Stack } from '~/components/ui/stack'
import { Table } from '~/components/ui/table'
import { TextField } from '~/components/ui/text-field'
import {
	type TWorkspaceIdLoader,
	deleteFormActionIntent,
	renameFormActionIntent,
} from '~/routes/(application)/(dashboard)/workspace/[workspaceId]'

export function FormsList() {
	const {
		data: { workspace },
	} = useLoaderData<TWorkspaceIdLoader>()

	const [defaultValue, setDefaultValue] = useState('')
	const [openRename, setOpenRename] = useState(false)
	const [openDelete, setOpenDelete] = useState(false)
	const [id, setId] = useState('')
	return (
		<>
			<Card>
				<Table aria-label="form table">
					<Table.Header>
						<Table.Column isRowHeader>Name</Table.Column>
						<Table.Column>
							<span className="sr-only">Actions</span>
						</Table.Column>
					</Table.Header>

					<Table.Body items={workspace.forms}>
						{(item) => (
							<Table.Row id={item.id}>
								<Table.Cell>{item.title}</Table.Cell>
								<Table.Cell>
									<Stack direction="row" justify="end">
										<Menu>
											<Menu.Trigger>
												<IconDotsVertical />
											</Menu.Trigger>
											<Menu.Content
												aria-label="Actions"
												showArrow
												placement="left"
											>
												<Menu.Item
													onAction={() => {
														setId(item.id)
														setOpenRename(true)
														setDefaultValue(item.title)
													}}
												>
													Rename
												</Menu.Item>
												<Menu.Separator />
												<Menu.Item
													onAction={() => {
														setId(item.id)
														setOpenDelete(true)
													}}
													isDanger
												>
													Delete
												</Menu.Item>
											</Menu.Content>
										</Menu>
									</Stack>
								</Table.Cell>
							</Table.Row>
						)}
					</Table.Body>
				</Table>
			</Card>

			<RenameDialog
				id={id}
				isOpen={openRename}
				onOpenChange={setOpenRename}
				defaultValue={defaultValue}
			/>

			<DeleteDialog isOpen={openDelete} onOpenChange={setOpenDelete} id={id} />
		</>
	)
}

interface RenameDialogProps extends Omit<DialogTriggerProps, 'children'> {
	id: string
	defaultValue: string
}

function RenameDialog({ id, defaultValue, ...props }: RenameDialogProps) {
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
					submit(formData, { method: 'post' })

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

interface DeleteDialogProps extends Omit<DialogTriggerProps, 'children'> {
	id: string
}

function DeleteDialog({ id, ...rest }: DeleteDialogProps) {
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
						formData.append('intent', deleteFormActionIntent)
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
