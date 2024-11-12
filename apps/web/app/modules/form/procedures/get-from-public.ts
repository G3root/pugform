import { jsonArrayFrom } from 'kysely/helpers/postgres'
import { baseProcedure } from '~/trpc/init'
import { GetFormSchema } from '../schema'

export const getFormPublicProcedure = baseProcedure
	.input(GetFormSchema)
	.query(async ({ ctx, input }) => {
		const { form, pages } = await ctx.db.transaction().execute(async (trx) => {
			const {
				id: fromId,
				workspaceId,
				...form
			} = await trx
				.selectFrom('form')
				.where('id', '=', input.formId)
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

			return { pages, form }
		})

		const meta = {
			totalPages:
				form.layout === 'CLASSIC'
					? pages.length
					: pages.flatMap((item) => item.fields).length,
		}

		const fieldData =
			form.layout === 'CLASSIC'
				? { pages }
				: { fields: pages.flatMap((item) => item.fields) }

		return {
			data: {
				form,
				meta,
				...fieldData,
			},
		}
	})
