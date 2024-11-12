import { useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { useActionData } from '@remix-run/react'

import type { TFormEditPageAction } from '~/routes/(application)/(dashboard)/forms/form-edit'
import { type TUpdateFormSchema, UpdateFormSchema } from '../schema'

type useBuilderFormProps = Partial<TUpdateFormSchema>

export function useBuilderForm(props?: useBuilderFormProps) {
	const actionData = useActionData<TFormEditPageAction>()
	const [form, fields] = useForm({
		id: 'builder-form',
		constraint: getZodConstraint(UpdateFormSchema),

		lastResult: actionData?.result,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: UpdateFormSchema })
		},
		shouldRevalidate: 'onBlur',
		defaultValue: {
			...props,
		},
	})

	return [form, fields, form.id] as const
}
