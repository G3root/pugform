import { useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { useActionData, useLoaderData, useSubmit } from '@remix-run/react'
import type { FormOptions } from 'node_modules/@conform-to/react/context'
import { useEffect, useMemo } from 'react'
import { z } from 'zod'
import type {
	TFormViewAction,
	TFormViewLoader,
} from '~/routes/(subDomain)/public-form-view'
import { FormMachineContext } from '../state-machines/form-machine'
import { createFieldSchema } from '../utils'

type JsonRecord = Record<string, unknown>

const convertJsonToFormData = (json: JsonRecord): FormData => {
	const formData = new FormData()

	for (const [key, value] of Object.entries(json)) {
		if (value != null) {
			// Handles both null and undefined
			formData.append(key, String(value))
		}
	}

	return formData
}

export function useResponseForm() {
	const submit = useSubmit()
	const currentStep = FormMachineContext.useSelector(
		(state) => state.context.currentPage,
	)

	const formActorRef = FormMachineContext.useActorRef()

	const { data } = useLoaderData<TFormViewLoader>()

	const schema = useMemo(() => {
		const fields =
			data.form.layout === 'CARD'
				? data.fields
				: data.pages?.[currentStep]?.fields

		return fields ? createFieldSchema(fields) : z.object({})
	}, [data.form.layout, data.fields, data.pages, currentStep])

	const actionData = useActionData<TFormViewAction>()

	const handleSubmit: FormOptions['onSubmit'] = (event, { submission }) => {
		event.preventDefault()

		if (!submission?.payload) return

		const context = formActorRef.getSnapshot().context
		const isLastPage = context.currentPage === context.totalPages - 1
		const payload = submission.payload as Record<string, string>

		if (isLastPage) {
			const mergedData = {
				...Object.assign({}, ...context.data),
				...payload,
			}
			submit(convertJsonToFormData(mergedData), { method: 'post' })
		} else {
			formActorRef.send({ type: 'UPDATE_DATA', data: payload })
			formActorRef.send({ type: 'NEXT' })
		}
	}

	const [form, fields] = useForm({
		id: 'builder-form',
		constraint: getZodConstraint(schema),
		lastResult: actionData?.result,
		onValidate: ({ formData }) => parseWithZod(formData, { schema }),
		shouldRevalidate: 'onBlur',
		onSubmit: handleSubmit,
	})

	useEffect(() => {
		if (actionData?.result.status === 'success') {
			formActorRef.send({ type: 'NEXT' })
		}
	}, [actionData?.result?.status, formActorRef])

	return [form, fields, form.id] as const
}
