import { useFormData } from '~/providers/form-data-provider'
import { useFormState } from '~/providers/form-state-provider'
import { Button } from '../common/button'
import { FormSubmitter } from '../common/form-submitter'
import { CardFormFieldRenderer } from './card-form-renderer'

export function CardForm() {
	const state = useFormState()
	const isEnding = state.pageType.value === 'ending'

	return (
		<>
			<ProgressBar />
			{isEnding ? <EndingPage /> : <FormPage />}
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

export function ProgressBar() {
	const state = useFormState()

	const progress = state.progressPercentage.value

	return (
		<div className="pf-fixed pf-top-0 pf-left-0 pf-w-full pf-h-1 pf-bg-primary/20 pf-z-50">
			<div
				className="pf-h-full pf-bg-primary pf-transition-all pf-duration-500 pf-ease-out"
				style={{ width: `${progress}%` }}
			/>
		</div>
	)
}

function FormPage() {
	const data = useFormData()
	const state = useFormState()

	const currentStep = state.currentPage.value

	const field = data?.fields?.[currentStep]

	return field ? (
		<div className="pf-max-w-3xl pf-w-full pf-h-full pf-mx-auto pf-flex pf-items-center pf-justify-center">
			<FormSubmitter className="pf-flex pf-justify-center pf-w-full pf-h-full pf-flex-col pf-gap-4 pf-p-6">
				<CardFormFieldRenderer key={field.id} {...field} />

				<div>
					<Button type="submit">Save</Button>
				</div>
			</FormSubmitter>
		</div>
	) : null
}
