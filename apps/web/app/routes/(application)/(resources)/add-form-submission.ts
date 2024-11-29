import { type NewAnswer, db, jsonArrayFrom } from '@pugform/database'
import { type Result, ResultAsync, err, fromPromise, ok } from 'neverthrow'
import * as Errors from '~/errors'
import { createFieldSchema } from '~/modules/form/utils'
import { IntegrationRegistry } from '~/modules/integration/registry'
import { IntegrationService } from '~/modules/integration/services'
import type { IntegrationFormData } from '~/modules/integration/types'
import { newId } from '~/utils/uuid'
import type { Route } from './+types/add-form-submission'

export async function action({ request, params, context }: Route.ActionArgs) {
	if (request.method !== 'POST') {
		return Response.json({ message: 'Method not allowed' }, { status: 405 })
	}

	const payload = await request.json()

	const formId = params.formId

	return ResultAsync.fromSafePromise(handleSubmission(formId, payload))
		.mapErr(Errors.mapRouteError)
		.match(
			() => Response.json({ status: 'success' as const }, { status: 200 }),
			(error) =>
				Response.json({ errorMsg: error.errorMsg }, { status: error.status }),
		)
}

async function handleSubmission(
	formId: string,
	payload: unknown,
): Promise<Result<string, Errors.RouteError>> {
	const form = await db
		.selectFrom('form')
		.where('id', '=', formId)
		.select(['id', 'organizationId', 'title', 'layout'])
		.executeTakeFirst()

	if (!form) {
		return err(Errors.badRequest('Form not found'))
	}

	const pages = await db
		.selectFrom('formPage')

		.where('formId', '=', form.id)
		.select((eb) => [
			jsonArrayFrom(
				eb
					.selectFrom('field as f')
					.selectAll()
					.whereRef('f.formPageId', '=', 'formPage.id'),
			).as('fields'),
		])
		.select(['formPage.id'])
		.execute()

	if (pages.length === 0) {
		return err(Errors.other('Pages not found'))
	}

	const fields = pages.flatMap((item) => item.fields)

	if (fields.length === 0) {
		return err(Errors.other('Fields not found'))
	}

	const schema = createFieldSchema(fields)

	const payloadData = schema.safeParse(payload)

	if (!payloadData.success) {
		return err(Errors.badRequest('Error validating fields with schema'))
	}

	const submissionValues = payloadData.data
	const responseTimeStamp = new Date()

	const responseResult = await db
		.insertInto('response')
		.values({
			formId: form.id,
			id: newId('response'),
			organizationId: form.organizationId,
			createdAt: responseTimeStamp,
			updatedAt: responseTimeStamp,
		})
		.returning(['id', 'createdAt'])
		.executeTakeFirstOrThrow()

	const answersToCreate: NewAnswer[] = []

	const responseData: IntegrationFormData = {
		id: responseResult.id,
		formId: formId,
		formName: form.title,
		timeStamp: responseResult.createdAt.toISOString(),
		responses: [],
	}

	for (const field of fields) {
		const submission = submissionValues?.[field.id]
		if (submission) {
			const answerId = newId('answer')

			const answerTimeStamp = new Date()

			answersToCreate.push({
				id: answerId,
				answer: submission,
				order: field.order,
				question: field.label,
				responseId: responseResult.id,
				type: field.type,
				fieldId: field.id,
				createdAt: answerTimeStamp,
				updatedAt: answerTimeStamp,
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
			responseId: responseResult.id,
			organizationId: form.organizationId,
		},
	})

	return ok(responseResult.id)
}
