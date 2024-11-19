import { parseWithZod } from '@conform-to/zod'
import { type NewAnswer, db } from '@pugform/database'
import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router';
import { data, useLoaderData } from 'react-router';
import { z } from 'zod'
import { CardForm } from '~/modules/form/components/card-form'
import { ClassicForm } from '~/modules/form/components/classic-form'
import { FormMachineContext } from '~/modules/form/state-machines/form-machine'
import { IntegrationRegistry } from '~/modules/integration/registry'
import { IntegrationService } from '~/modules/integration/services'
import type { IntegrationFormData } from '~/modules/integration/types'

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
			{ result: submission.reply(), status: 'failed' as const },
			{ status: submission.status === 'error' ? 400 : 200 },
		)
	}

	const submissionValues = submission.value
	const form = await db
		.selectFrom('form')
		.where('id', '=', formId)
		.select(['id', 'organizationId', 'title'])
		.executeTakeFirstOrThrow()

	const response = await db
		.insertInto('response')
		.values({
			formId: form.id,
			id: newId('response'),
			organizationId: form.organizationId,
			createdAt: new Date(),
			updatedAt: new Date(),
		})
		.returning(['id', 'createdAt'])
		.executeTakeFirstOrThrow()

	const fields = await db
		.selectFrom('field')
		.where('formId', '=', form.id)
		.select(['id', 'label', 'type', 'order'])
		.execute()

	const answersToCreate: NewAnswer[] = []

	const responseData: IntegrationFormData = {
		id: response.id,
		formId: formId,
		formName: form.title,
		timeStamp: response.createdAt.toISOString(),
		responses: [],
	}

	for (const field of fields) {
		const submission = submissionValues?.[field.id]
		if (submission) {
			const answerId = newId('answer')

			answersToCreate.push({
				id: answerId,
				answer: submission,
				order: field.order,
				question: field.label,
				responseId: response.id,
				type: field.type,
				fieldId: field.id,
				createdAt: new Date(),
				updatedAt: new Date(),
			})
			responseData.responses.push({
				id: answerId,
				answer: submission,
				question: field.label,
				type: field.type,
			})
		}
	}

	await db.insertInto('answer').values(answersToCreate).execute()

	const integrationService = new IntegrationService(new IntegrationRegistry())

	await integrationService.processFormSubmission({
		formData: responseData,
		context: {
			formId: form.id,
			responseId: response.id,
			organizationId: form.organizationId,
		},
	})

	return data(
		{ result: submission.reply(), status: 'success' as const },
		{ status: 200 },
	)
}

export type TFormViewLoader = typeof loader
export type TFormViewAction = typeof action

export default function PublicFormView() {
	const { data } = useLoaderData<TFormViewLoader>()

	return (
		<FormMachineContext.Provider
			options={{
				input: { currentPage: 0, totalPage: data.meta.totalPages },
			}}
		>
			{data.form.layout === 'CLASSIC' ? <ClassicForm /> : <CardForm />}
		</FormMachineContext.Provider>
	)
}
