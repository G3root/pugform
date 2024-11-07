import { parseWithZod } from '@conform-to/zod'
import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { data, useLoaderData } from '@remix-run/react'
import { z } from 'zod'
import { type NewAnswer, db } from '~/lib/db.server'
import { ClassicForm } from '~/modules/form/components/classic-form'
import { FormMachineContext } from '~/modules/form/state-machines/form-machine'

import { trpcServer } from '~/trpc/server'
import { newId } from '~/utils/uuid'

export async function loader({ request, context, params }: LoaderFunctionArgs) {
	const formId = params.formId as string

	const { data } = await trpcServer({ request, context }).form.getPublic({
		formId,
	})
	return {
		data,
	}
}

export async function action({ request, context, params }: ActionFunctionArgs) {
	const formData = await request.formData()
	const formId = params.formId as string

	const submission = parseWithZod(formData, {
		schema: z.record(z.string()),
	})

	if (submission.status !== 'success') {
		return data(
			{ result: submission.reply() },
			{ status: submission.status === 'error' ? 400 : 200 },
		)
	}

	const submissionValues = submission.value
	const form = await db
		.selectFrom('form')
		.where('id', '=', formId)
		.select(['id', 'organizationId'])
		.executeTakeFirstOrThrow()

	const response = await db
		.insertInto('response')
		.values({
			formId: form.id,
			id: newId('response'),
			organizationId: form.organizationId,
		})
		.returning(['id'])
		.executeTakeFirstOrThrow()

	const fields = await db
		.selectFrom('field')
		.where('formId', '=', form.id)
		.select(['id', 'label', 'type', 'order'])
		.execute()

	const answersToCreate: NewAnswer[] = []

	for (const field of fields) {
		const submission = submissionValues?.[field.id]
		if (submission) {
			answersToCreate.push({
				id: newId('answer'),
				answer: submission,
				order: field.order,
				question: field.label,
				responseId: response.id,
				type: field.type,
				fieldId: field.id,
			})
		}
	}

	await db.insertInto('answer').values(answersToCreate).execute()

	return {}
}

export type TFormViewLoader = typeof loader

export default function PublicFormView() {
	const { data } = useLoaderData<TFormViewLoader>()

	return (
		<FormMachineContext.Provider
			options={{
				input: { currentPage: 0, totalPage: data.meta.totalPages },
			}}
		>
			{data.form.layout === 'CLASSIC' ? <ClassicForm /> : null}
		</FormMachineContext.Provider>
	)
}
