import { useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { useActionData, useLoaderData } from '@remix-run/react'
import { useMemo } from 'react'
import { z } from 'zod'
import type { TFormViewLoader } from '~/routes/(subDomain)/public-form-view'
import { FormMachineContext } from '../state-machines/form-machine'
import { createFieldSchema } from '../utils'

export function useResponseForm() {
	const currentStep = FormMachineContext.useSelector(
		(state) => state.context.currentPage,
	)

	const formActorRef = FormMachineContext.useActorRef()

	const { data } = useLoaderData<TFormViewLoader>()

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	const Schema = useMemo(() => {
		const fields =
			data.form.layout === 'CARD'
				? data.fields
				: data.pages?.[currentStep].fields

		return fields ? createFieldSchema(fields) : z.object({})
	}, [currentStep])

	const actionData = useActionData()
	const [form, fields] = useForm({
		id: 'builder-form',
		constraint: getZodConstraint(Schema),
		lastResult: actionData?.result,
		onValidate({ formData }) {
			console.log({ validate: parseWithZod(formData, { schema: Schema }) })

			return parseWithZod(formData, { schema: Schema })
		},
		shouldRevalidate: 'onBlur',
		onSubmit(event, { submission }) {
			event.preventDefault()

			if (submission?.payload) {
				formActorRef.send({
					type: 'UPDATE_DATA',
					data: { ...(submission.payload as Record<string, string>) },
				})

				formActorRef.send({ type: 'NEXT' })
			}
		},
	})

	return [form, fields, form.id] as const
}
