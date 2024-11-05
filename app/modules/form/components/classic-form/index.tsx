import { Form, useLoaderData } from '@remix-run/react'
import { Button } from '~/components/ui/button'
import { Container } from '~/components/ui/container'
import { Stack } from '~/components/ui/stack'
import type { TFormViewLoader } from '~/routes/(subDomain)/public-form-view'
import { ClassicFieldRenderer } from './classic-field-renderer'

export function ClassicForm() {
	const { data } = useLoaderData<TFormViewLoader>()

	return (
		<Form
			method="POST"
			className="flex items-center justify-center min-h-screen"
		>
			{data.pages.map((page) => (
				<Container
					className="max-w-3xl bg-bg rounded-xl w-full border h-full"
					key={page.id}
				>
					<Stack direction="column" className="p-6">
						{page.fields.map((field) => (
							<ClassicFieldRenderer key={field.id} {...field} />
						))}

						<Button type="submit">Save</Button>
					</Stack>
				</Container>
			))}
		</Form>
	)
}
