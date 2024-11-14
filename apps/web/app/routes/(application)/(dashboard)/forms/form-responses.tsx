import type { LoaderFunctionArgs } from 'react-router';
import { useLoaderData } from 'react-router';
import { Card } from '~/components/ui/card'
import { Table } from '~/components/ui/table'
import { dayjsExt } from '~/lib/day-js'
import { trpcServer } from '~/trpc/server'

export async function loader({ request, context, params }: LoaderFunctionArgs) {
	const formId = params.formId as string

	const responses = await trpcServer({ request, context }).form.responses({
		formId,
	})

	return responses
}

export type TFormResponseLoader = typeof loader

export default function FormResponses() {
	const { data } = useLoaderData<TFormResponseLoader>()
	return (
		<Card>
			<Table aria-label="Form responses">
				<Table.Header>
					<Table.Column isRowHeader>Submitted date</Table.Column>
					{data.labels.map((item) => (
						<Table.Column key={item}>{item}</Table.Column>
					))}
				</Table.Header>
				<Table.Body items={data.responses}>
					{(item) => (
						<Table.Row id={item.id}>
							<Table.Cell>{dayjsExt(item.createdAt).format('L LT')}</Table.Cell>
							{item.answers.map((answer) => (
								<Table.Cell key={answer.id}>{answer.answer}</Table.Cell>
							))}
						</Table.Row>
					)}
				</Table.Body>
			</Table>
		</Card>
	)
}
