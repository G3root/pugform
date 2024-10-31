import { useFetcher, useLoaderData } from '@remix-run/react'
import { useRef, useState } from 'react'
import type { DialogTriggerProps } from 'react-aria-components'
import { Button } from '~/components/ui/button'
import { Modal } from '~/components/ui/modal'
import { Stack } from '~/components/ui/stack'
import { Table } from '~/components/ui/table'
import {
	type TAllWorkspaceLoader,
	workspaceDeleteActionIntent,
} from '~/routes/(application)/(dashboard)/workspace/all-workspaces'

export function WorkspaceList() {
	const {
		data: { workspaces },
	} = useLoaderData<TAllWorkspaceLoader>()

	const [open, setOpen] = useState(false)
	const [id, setId] = useState('')
	return (
		<>
			<Table aria-label="workspace list">
				<Table.Header>
					<Table.Column isRowHeader>Name</Table.Column>
					<Table.Column />
				</Table.Header>

				<Table.Body items={workspaces}>
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

										<Button appearance="outline" size="extra-small">
											View
										</Button>
									</Stack>
								</div>
							</Table.Cell>
						</Table.Row>
					)}
				</Table.Body>
			</Table>
			<DeleteDialog id={id} isOpen={open} onOpenChange={setOpen} />
		</>
	)
}

interface DeleteDialogProps extends Omit<DialogTriggerProps, 'children'> {
	id: string
}

function DeleteDialog({ id, ...rest }: DeleteDialogProps) {
	const fetcher = useFetcher()
	const submitRef = useRef<HTMLButtonElement>(null)
	return (
		<Modal.Content {...rest} role="alertdialog">
			<Modal.Header>
				<Modal.Title>Delete workspace</Modal.Title>
				<Modal.Description>
					This will permanently delete the workspace, all forms, and form
					responses within it.
				</Modal.Description>
			</Modal.Header>

			<fetcher.Form method="POST">
				<input type="hidden" name="id" value={id} readOnly />
				<button
					name="intent"
					value={workspaceDeleteActionIntent}
					ref={submitRef}
					aria-hidden
					className="sr-only"
					type="submit"
				>
					form Submit
				</button>
			</fetcher.Form>

			<Modal.Footer>
				<Modal.Close appearance="outline">Cancel</Modal.Close>
				<Modal.Close
					onPress={() => {
						submitRef.current?.click()
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
