import { useMachine } from '~/hooks/use-machine'
import { useFormData } from '~/providers/form-data-provider'
import { formMachine } from '~/state-machines/form-machine'
import { Button } from '../common/button'
import { CardFormFieldRenderer } from './card-form-renderer'

export function CardForm() {
	const data = useFormData()
	const [current, send] = useMachine(formMachine, {
		currentPage: 0,
		totalPages: data.totalPages,
	})

	return (
		<>
			<FormPage />
		</>
	)
}

function EndingPage() {
	return (
		<div>
			<h1 className="font-sans tracking-tight text-fg font-bold text-xl sm:text-2xl">
				Thanks for completing this form
			</h1>
		</div>
	)
}

function FormPage() {
	const data = useFormData()

	const [current, send] = useMachine(formMachine, {
		currentPage: 0,
		totalPages: data.totalPages,
	})

	const isPage = current.name === 'page'
	const currentStep = current.context.currentPage

	if (!isPage) {
		return null
	}

	const field = data?.fields?.[currentStep]

	return field ? (
		<div className="pf-max-w-3xl pf-bg-bg pf-rounded-xl pf-w-full pf-border pf-h-full">
			<div className="pf-flex pf-flex-col pf-gap-4 pf-p-6">
				<CardFormFieldRenderer key={field.id} {...field} />

				<div>
					<Button type="submit">Save</Button>
				</div>
			</div>
		</div>
	) : null
}
