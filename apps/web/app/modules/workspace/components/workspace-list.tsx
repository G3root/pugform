import { Link, useRouteLoaderData, useSubmit } from '@remix-run/react'
import { useRef, useState } from 'react'
import type { DialogTriggerProps } from 'react-aria-components'
import { Button, buttonStyles } from '~/components/ui/button'
import { Modal } from '~/components/ui/modal'
import { Stack } from '~/components/ui/stack'
import { Table } from '~/components/ui/table'
import type { TDashboardLoader } from '~/routes/(application)/(dashboard)/_layout'
import { workspaceDeleteActionIntent } from '~/routes/(application)/(dashboard)/workspace/all-workspaces'

export function WorkspaceList() {
	const data = useRouteLoaderData<TDashboardLoader>(
		'./routes/(application)/(dashboard)/_layout',
	)

	const [open, setOpen] = useState(false)
	const [id, setId] = useState('')
	return (
		<>
			{data?.workspaces ? (
				<Table aria-label="workspace list">
					<Table.Header>
						<Table.Column isRowHeader>Name</Table.Column>
						<Table.Column />
					</Table.Header>

					<Table.Body
						items={data.workspaces}
						renderEmptyState={() => 'No results found.'}
					>
						{(item) => (
							<Table.Row id={item.id}>
								<Table.Cell>{item.name}</Table.Cell>

								<Table.Cell>
									<div className="flex justify-end">
										<Stack direction="row">
											<Button
												onPress={() => {
													setId(item.id)
													setOpen(true)
												}}
												appearance="outline"
												size="extra-small"
											>
												Delete
											</Button>

											<Link
												to={`/dashboard/workspaces/${item.publicId}`}
												className={buttonStyles({
													appearance: 'outline',
													size: 'extra-small',
												})}
											>
												View
											</Link>
										</Stack>
									</div>
								</Table.Cell>
							</Table.Row>
						)}
					</Table.Body>
				</Table>
			) : null}
			<DeleteDialog id={id} isOpen={open} onOpenChange={setOpen} />
		</>
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
				<Modal.Title>Delete workspace</Modal.Title>
				<Modal.Description>
					This will permanently delete the workspace, all forms, and form
					responses within it.
				</Modal.Description>
			</Modal.Header>

			<Modal.Footer>
				<Modal.Close appearance="outline">Cancel</Modal.Close>
				<Modal.Close
					onPress={() => {
						const formData = new FormData()
						formData.append('id', id)
						formData.append('intent', workspaceDeleteActionIntent)
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
