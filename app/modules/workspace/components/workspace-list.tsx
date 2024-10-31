import { useLoaderData } from '@remix-run/react'
import { Button } from '~/components/ui/button'
import { Stack } from '~/components/ui/stack'
import { Table } from '~/components/ui/table'
import type { TAllWorkspaceLoader } from '~/routes/(application)/(dashboard)/workspace/all-workspaces'

export function WorkspaceList() {
	const {
		data: { workspaces },
	} = useLoaderData<TAllWorkspaceLoader>()

	return (
		<Table aria-label="Products">
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
									<Button appearance="outline" size="extra-small">
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
	)
}
