import { Show, createEffect, createSignal } from 'solid-js'
import type { TField } from '~/providers/form-data-context'
import { useFormData } from '~/providers/form-data-provider'
import { useFormState } from '~/providers/form-state-provider'
import { Button } from '../common/button'
import { FormSubmitter } from '../common/form-submitter'
import { CardFormFieldRenderer } from './card-form-renderer'

export function CardForm() {
	const [state] = useFormState()

	return (
		<>
			<ProgressBar />
			<Show when={state.pageType === 'ending'}>
				<EndingPage />
			</Show>
			<Show when={state.pageType === 'form'}>
				<FormPage />
			</Show>
		</>
	)
}

function EndingPage() {
	return (
		<div>
			<h1 class="pf-font-sans pf-tracking-tight pf-text-fg pf-font-bold pf-text-xl sm:pf-text-2xl">
				Thanks for completing this form
			</h1>
		</div>
	)
}

export function ProgressBar() {
	const [state] = useFormState()

	const progress = state.progressPercentage

	return (
		<div class="pf-fixed pf-top-0 pf-left-0 pf-w-full pf-h-1 pf-bg-primary/20 pf-z-50">
			<div
				class="pf-h-full pf-bg-primary pf-transition-all pf-duration-500 pf-ease-out"
				style={{ width: `${progress}%` }}
			/>
		</div>
	)
}

function FormPage() {
	const data = useFormData()
	const [state] = useFormState()
	const [field, setField] = createSignal<TField | undefined>(undefined)

	createEffect(() => {
		const currentStep = state.currentPage

		setField(data?.fields?.[currentStep])
	})

	return (
		<Show when={field()} keyed fallback={null}>
			{(fieldValue) => (
				<div class="pf-max-w-3xl pf-w-full pf-h-full pf-mx-auto pf-flex pf-items-center pf-justify-center">
					<FormSubmitter class="pf-flex pf-justify-center pf-w-full pf-h-full pf-flex-col pf-gap-4 pf-p-6">
						<CardFormFieldRenderer {...fieldValue} />

						<div>
							<Button type="submit">Save</Button>
						</div>
					</FormSubmitter>
				</div>
			)}
		</Show>
	)
}
