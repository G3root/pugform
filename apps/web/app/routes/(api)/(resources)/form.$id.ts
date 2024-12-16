import { db, jsonArrayFrom } from '@pugform/database'
import { ResultAsync } from 'neverthrow'
import * as Errors from '~/errors'
import { FormIdSchema } from '~/modules/form/schema'
import type { Route } from './+types/form.$id'

export async function loader({ request, params, context }: Route.LoaderArgs) {
	if (request.method === 'GET') {
		return getFormById({ context, params, request })
	}

	return Response.json({ message: 'Method not allowed' }, { status: 405 })
}

function getFormById({ params }: Route.LoaderArgs) {
	return ResultAsync.fromPromise(FormIdSchema.parseAsync(params.formId), () =>
		Errors.badRequest('Error validating fields with schema'),
	)
		.map((formId) => ({ formId }))
		.andThen(({ formId }) =>
			ResultAsync.fromPromise(
				db.transaction().execute(async (trx) => {
					const {
						id: fromId,
						workspaceId,
						...form
					} = await trx
						.selectFrom('form')
						.where('id', '=', formId)
						// .where('status', '=', 'PUBLISHED')
						.select(['id', 'layout', 'status', 'title', 'workspaceId'])
						.executeTakeFirstOrThrow()

					const pages = await trx
						.selectFrom('formPage')

						.where('formId', '=', fromId)
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

					return { pages, form: { ...form, id: fromId } }
				}),

				() => Errors.badRequest('Form not found'),
			),
		)
		.map(({ form, pages }) => {
			const data =
				form.layout === 'CLASSIC' ? pages : pages.flatMap((item) => item.fields)

			return {
				data: {
					id: form.id,
					layout: form.layout,
					totalPages: data.length,
					fields: form.layout === 'CARD' ? data : undefined,
					pages: form.layout === 'CLASSIC' ? data : undefined,
				},
			}
		})
		.mapErr(Errors.mapRouteError)
		.match(
			(data) =>
				Response.json(
					{ status: 'success' as const, data: data.data },
					{ status: 200 },
				),
			(error) =>
				Response.json(
					{ status: 'failed' as const, errorMsg: error.errorMsg },
					{ status: error.status },
				),
		)
}
