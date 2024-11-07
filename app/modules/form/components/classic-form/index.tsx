import { useLoaderData } from '@remix-run/react'
import { Button } from '~/components/ui/button'
import { Container } from '~/components/ui/container'
import { Heading } from '~/components/ui/heading'
import { Stack } from '~/components/ui/stack'
import type { TFormViewLoader } from '~/routes/(subDomain)/public-form-view'
import { FormMachineContext } from '../../state-machines/form-machine'
import { ResponseForm } from '../response-form'
import { ClassicFieldRenderer } from './classic-field-renderer'

export function ClassicForm() {
	return (
		<ResponseForm className="flex items-center justify-center min-h-screen">
			<FormPage />
			<EndingPage />
		</ResponseForm>
	)
}

function EndingPage() {
	const isEnding = FormMachineContext.useSelector((state) =>
		state.matches('ending'),
	)

	if (!isEnding) {
		return null
	}

	return (
		<div>
			<Heading>Thanks for completing this form</Heading>
		</div>
	)
}

function FormPage() {
	const { data } = useLoaderData<TFormViewLoader>()
	const isPage = FormMachineContext.useSelector((state) =>
		state.matches('page'),
	)
	const currentStep = FormMachineContext.useSelector(
		(state) => state.context.currentPage,
	)

	if (!isPage) {
		return null
	}

	const fields = data.pages?.[currentStep]?.fields

	return fields && fields.length > 0 ? (
		<Container className="max-w-3xl bg-bg rounded-xl w-full border h-full">
			<Stack direction="column" className="p-6">
				{fields.map((field) => (
					<ClassicFieldRenderer key={field.id} {...field} />
				))}

				<div>
					<Button type="submit">Save</Button>
				</div>
			</Stack>
		</Container>
	) : null
}
