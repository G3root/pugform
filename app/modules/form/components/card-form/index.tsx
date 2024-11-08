import { useLoaderData } from '@remix-run/react'
import { Button } from '~/components/ui/button'
import { Container } from '~/components/ui/container'
import { Heading } from '~/components/ui/heading'
import { Stack } from '~/components/ui/stack'
import type { TFormViewLoader } from '~/routes/(subDomain)/public-form-view'
import { FormMachineContext } from '../../state-machines/form-machine'
import { ResponseForm } from '../response-form'
import { CardFormFieldRenderer } from './card-form-renderer'
import { ProgressBar } from './progress-bar'

export function CardForm() {
	return (
		<>
			<ResponseForm className="flex flex-col items-center justify-center min-h-screen">
				<ProgressBar />
				<FormPage />
				<EndingPage />
			</ResponseForm>
		</>
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
	const currentStep = FormMachineContext.useSelector(
		(state) => state.context.currentPage,
	)
	const isPage = FormMachineContext.useSelector((state) =>
		state.matches('page'),
	)

	if (!isPage) {
		return null
	}

	const field = data?.fields?.[currentStep]

	return field ? (
		<Container className="max-w-3xl w-full h-full">
			<Stack direction="column" className="p-6">
				<CardFormFieldRenderer key={field.id} {...field} />

				<div>
					<Button type="submit">Save</Button>
				</div>
			</Stack>
		</Container>
	) : null
}
