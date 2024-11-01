import { useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { useActionData } from '@remix-run/react'
import type { TBuilderPageAction } from '~/routes/(application)/(dashboard)/forms/create'
import { newId } from '~/utils/uuid'
import { CreateFormSchema } from '../schema'

const defaultPage = newId('page')

export function useBuilderForm() {
	const actionData = useActionData<TBuilderPageAction>()
	const [form, fields] = useForm({
		id: 'builder-form',
		constraint: getZodConstraint(CreateFormSchema),

		lastResult: actionData?.result,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: CreateFormSchema })
		},
		shouldRevalidate: 'onBlur',
		defaultValue: {
			fieldPages: [defaultPage],
		},
	})

	return [form, fields, form.id] as const
}
