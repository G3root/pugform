import { useFormData } from '~/providers/form-data-provider'
import { useFormState } from '~/providers/form-state-provider'
import { Button } from '../common/button'
import { ClassicFieldRenderer } from './classic-form-renderer'

export function ClassicForm() {
	const state = useFormState()
	const isEnding = state.pageType.value === 'ending'

	return isEnding ? <EndingPage /> : <FormPage />
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
	const state = useFormState()
	const currentStep = state.currentPage.value

	const fields = data.pages?.[currentStep]?.fields

	return fields && fields.length > 0 ? (
		<div className="pf-max-w-3xl pf-bg-bg pf-rounded-xl pf-w-full pf-border pf-h-full">
			<div className="pf-flex pf-flex-col pf-gap-4 pf-p-6">
				{fields.map((field) => (
					<ClassicFieldRenderer key={field.id} {...field} />
				))}

				<div>
					<Button type="submit">Save</Button>
				</div>
			</div>
		</div>
	) : null
}
