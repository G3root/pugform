import { batch } from '@preact/signals'
import { clsx } from 'clsx/lite'
import type { ComponentChildren } from 'preact'
import { useFormData } from '~/providers/form-data-provider'
import { useFormState } from '~/providers/form-state-provider'

interface FormSubmitterProps {
	className?: string
	children: ComponentChildren
}

export function FormSubmitter({ children, className }: FormSubmitterProps) {
	const formState = useFormState()
	const formData = useFormData()
	const addData = (data: Record<string, string>) => {
		batch(() => {
			formState.data.value = [...formState.data.value, data]
			formState.currentPage.value++
		})
	}

	const next = () => {
		formState.currentPage.value++
	}

	return (
		<form
			onSubmit={async (e) => {
				e.preventDefault()
				e.stopPropagation()
				const form = e.currentTarget

				const formDataObj = Object.fromEntries(
					new FormData(form).entries(),
				) as Record<string, string>

				const isLastPage = formState.isLastPage.peek()

				if (isLastPage) {
					const mergedData = {
						...Object.assign({}, ...formState.data.peek()),
						...formDataObj,
					}

					const req = await fetch(
						`http://localhost:3000/resources/form-submission/${formData.id}`,
						{
							method: 'POST',
							body: JSON.stringify(mergedData),
							headers: {
								'Content-Type': 'application/json',
							},
						},
					)

					if (!req.ok) {
						throw new Error('Error submitting data')
					}

					const res = await req.json()

					next()
				}

				if (!isLastPage) {
					addData(formDataObj)
				}
			}}
			className={clsx(className)}
		>
			{children}
		</form>
	)
}
