import { useLoaderData, useSubmit } from '@remix-run/react'
import { IconDotsVertical } from 'justd-icons'
import { Card } from '~/components/ui/card'
import { Menu } from '~/components/ui/menu'
import { Stack } from '~/components/ui/stack'
import { Table } from '~/components/ui/table'
import {
	type TWorkspaceIdLoader,
	deleteFormActionIntent,
} from '~/routes/(application)/(dashboard)/workspace/[workspaceId]'

export function FormsList() {
	const {
		data: { workspace },
	} = useLoaderData<TWorkspaceIdLoader>()

	const submit = useSubmit()
	return (
		<Card>
			<Table>
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
											<Menu.Separator />
											<Menu.Item
												onAction={() => {
													const formData = new FormData()
													formData.append('formId', item.id)
													formData.append('intent', deleteFormActionIntent)
													submit(formData, { method: 'post' })
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
	)
}
