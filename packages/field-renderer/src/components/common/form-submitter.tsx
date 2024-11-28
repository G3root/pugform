import { batch } from '@preact/signals'
import { clsx } from 'clsx/lite'
import type { ComponentChildren } from 'preact'
import { useFormState } from '~/providers/form-state-provider'

interface FormSubmitterProps {
	className?: string
	children: ComponentChildren
}

export function FormSubmitter({ children, className }: FormSubmitterProps) {
	const formState = useFormState()
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
			onSubmit={(e) => {
				e.preventDefault()
				e.stopPropagation()
				const form = e.currentTarget

				const formDataObj = Object.fromEntries(
					new FormData(form).entries(),
				) as Record<string, string>

				const isLastPage = formState.isLastPage.peek()

				if (isLastPage) {
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
