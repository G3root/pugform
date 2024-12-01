import { type NewAnswer, db, jsonArrayFrom } from '@pugform/database'
import { ResultAsync, err, errAsync, ok } from 'neverthrow'
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

	return ResultAsync.fromPromise(
		db.transaction().execute(async (trx) => {
			const form = await trx
				.selectFrom('form')
				.where('id', '=', formId)
				.select(['id', 'organizationId', 'title', 'layout'])
				.executeTakeFirst()

			if (!form) {
				throw new Error('form not found')
			}

			const pages = await trx
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
			return { form, pages }
		}),

		() => Errors.badRequest('failed fetching form'),
	)
		.andThen(({ form, pages }) => {
			const fields = pages.flatMap((item) => item.fields)

			if (fields.length === 0) {
				return err(Errors.other('Fields not found'))
			}

			const schema = createFieldSchema(fields)
			const payloadData = schema.safeParse(payload)

			if (!payloadData.success) {
				return err(Errors.badRequest('Error validating fields with schema'))
			}

			return ok({ form, fields, submissionValues: payloadData.data })
		})
		.andThen(({ form, fields, submissionValues }) => {
			const responseTimeStamp = new Date()

			return ResultAsync.fromPromise(
				db
					.insertInto('response')
					.values({
						formId: form.id,
						id: newId('response'),
						organizationId: form.organizationId,
						createdAt: responseTimeStamp,
						updatedAt: responseTimeStamp,
					})
					.returning(['id', 'createdAt'])
					.executeTakeFirstOrThrow(),
				() => Errors.other('Failed to insert response'),
			).map((responseResult) => ({
				form,
				fields,
				submissionValues,
				responseResult,
			}))
		})
		.andThen(({ form, fields, submissionValues, responseResult }) => {
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

			return ResultAsync.fromPromise(
				db.insertInto('answer').values(answersToCreate).execute(),
				() => Errors.other('Failed to insert answers'),
			).map(() => ({ form, responseResult, responseData }))
		})
		.andThen(({ form, responseResult, responseData }) => {
			const integrationService = new IntegrationService(
				new IntegrationRegistry(),
			)

			return ResultAsync.fromPromise(
				integrationService.processFormSubmission({
					formData: responseData,
					context: {
						formId: form.id,
						responseId: responseResult.id,
						organizationId: form.organizationId,
					},
				}),
				() => Errors.other('Integration processing failed'),
			)
		})
		.mapErr(Errors.mapRouteError)
		.match(
			() => Response.json({ status: 'success' as const }, { status: 200 }),
			(error) =>
				Response.json({ errorMsg: error.errorMsg }, { status: error.status }),
		)
}
