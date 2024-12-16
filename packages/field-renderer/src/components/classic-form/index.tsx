import { For, Match, Show, Switch, createEffect, createSignal } from 'solid-js'
import type { TField } from '~/providers/form-data-context'
import { useFormData } from '~/providers/form-data-provider'
import { useFormState } from '~/providers/form-state-provider'
import { Button } from '../common/button'
import { ClassicFieldRenderer } from './classic-form-renderer'

export function ClassicForm() {
	const [state] = useFormState()

	return (
		<Switch>
			<Match when={state.pageType === 'ending'}>
				<EndingPage />
			</Match>
			<Match when={state.pageType === 'form'}>
				<FormPage />
			</Match>
		</Switch>
	)
}

function EndingPage() {
	return (
		<div>
			<h1 class="font-sans tracking-tight text-fg font-bold text-xl sm:text-2xl">
				Thanks for completing this form
			</h1>
		</div>
	)
}

function FormPage() {
	const data = useFormData()
	const [state] = useFormState()
	const [fields, setFields] = createSignal<TField[] | undefined>(undefined)

	createEffect(() => {
		const currentStep = state.currentPage

		setFields(data.pages?.[currentStep]?.fields)
	})

	return (
		<Show when={fields()} keyed fallback={null}>
			{(fieldValue) => (
				<div class="pf-flex pf-items-center pf-justify-center pf-flex-col pf-w-full pf-max-w-3xl ">
					<div class="pf-bg-bg pf-rounded-xl pf-w-full pf-border pf-h-full">
						<div class="pf-flex pf-flex-col pf-gap-4 pf-p-6">
							<For each={fieldValue}>
								{(field) => <ClassicFieldRenderer {...field} />}
							</For>

							<div>
								<Button type="submit">Save</Button>
							</div>
						</div>
					</div>
				</div>
			)}
		</Show>
	)
}
