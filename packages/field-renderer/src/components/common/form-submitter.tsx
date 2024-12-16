import { type ComponentProps, type ParentProps, splitProps } from 'solid-js'
import { useFormData } from '~/providers/form-data-provider'
import { useFormState } from '~/providers/form-state-provider'

export function FormSubmitter(props: ComponentProps<'form'>) {
	const [local, others] = splitProps(props, ['children'])
	const [formState, setFormState] = useFormState()
	const formData = useFormData()
	const addData = (data: Record<string, string>) => {
		setFormState((prev) => ({
			...prev,
			currentPage: prev.currentPage + 1,
			data: [...prev.data, data],
		}))
	}

	const next = () => {
		setFormState((prev) => ({ ...prev, currentPage: prev.currentPage + 1 }))
	}

	return (
		<form
			{...others}
			onSubmit={async (e) => {
				e.preventDefault()
				e.stopPropagation()
				const form = e.currentTarget

				const formDataObj = Object.fromEntries(
					new FormData(form).entries(),
				) as Record<string, string>

				const isLastPage = formState.isLastPage

				if (isLastPage) {
					const mergedData = {
						...Object.assign({}, ...formState.data),
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
		>
			{local.children}
		</form>
	)
}
