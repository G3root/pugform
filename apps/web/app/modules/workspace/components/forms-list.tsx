import { IconDotsVertical } from 'justd-icons'
import { useState } from 'react'
import { Link, useLoaderData } from 'react-router'
import { buttonStyles } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { Menu } from '~/components/ui/menu'
import { Stack } from '~/components/ui/stack'
import { Table } from '~/components/ui/table'
import { FormDeleteDialog } from '~/modules/form/components/form-delete-dialog'
import { FormRenameDialog } from '~/modules/form/components/form-rename-dialog'
import type { TWorkspaceIdLoader } from '~/routes/(application)/(dashboard)/workspace/[workspaceId]'

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
										<Link
											to={`/dashboard/forms/${item.id}/edit`}
											className={buttonStyles({
												appearance: 'outline',
												size: 'extra-small',
											})}
										>
											Edit
										</Link>

										<Link
											to={`/dashboard/forms/${item.id}`}
											className={buttonStyles({
												appearance: 'outline',
												size: 'extra-small',
											})}
										>
											View
										</Link>

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

			<FormRenameDialog
				id={id}
				isOpen={openRename}
				onOpenChange={setOpenRename}
				defaultValue={defaultValue}
			/>

			<FormDeleteDialog
				isOpen={openDelete}
				onOpenChange={setOpenDelete}
				id={id}
			/>
		</>
	)
}
