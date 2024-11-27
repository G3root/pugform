import { useMachine } from '~/hooks/use-machine'
import { useFormData } from '~/providers/form-data-provider'
import { formMachine } from '~/state-machines/form-machine'
import { Button } from '../common/button'
import { ClassicFieldRenderer } from './classic-form-renderer'

export function ClassicForm() {
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

	const fields = data.pages?.[currentStep]?.fields

	return fields && fields.length > 0 ? (
		<div className="max-w-3xl bg-bg rounded-xl w-full border h-full">
			<div className="flex flex-col gap-4 p-6">
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
