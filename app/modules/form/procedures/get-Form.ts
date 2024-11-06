import { jsonArrayFrom } from 'kysely/helpers/postgres'
import { withAuthProcedure } from '~/trpc/init'
import { GetFormSchema } from '../schema'

export const getFormProcedure = withAuthProcedure
	.input(GetFormSchema)
	.query(async ({ ctx, input }) => {
		const organizationId = ctx.session.organizationId

		const { form, pages, workspace } = await ctx.db
			.transaction()
			.execute(async (trx) => {
				const {
					id: fromId,
					workspaceId,
					...form
				} = await trx
					.selectFrom('form')
					.where('id', '=', input.formId)
					.where('organizationId', '=', organizationId)
					.select(['id', 'layout', 'status', 'title', 'workspaceId'])
					.executeTakeFirstOrThrow()

				const workspace = await trx
					.selectFrom('workspace')
					.where('organizationId', '=', organizationId)
					.where('id', '=', workspaceId)
					.select(['name', 'publicId'])
					.executeTakeFirstOrThrow()

				const pages = await trx
					.selectFrom('formPage')
					.where('organizationId', '=', organizationId)
					.where('formId', '=', fromId)
					.select((eb) => [
						jsonArrayFrom(
							eb
								.selectFrom('field as f')
								.select([
									'f.label',
									'f.id',
									'f.type',
									'f.required',
									'f.description',
									'f.placeholder',
									'f.options',
								])
								.whereRef('f.formPageId', '=', 'formPage.id'),
						).as('fields'),
					])
					.select(['formPage.id'])
					.execute()

				return { pages, workspace, form }
			})

		return {
			data: {
				form,
				pages,
				workspace,
			},
		}
	})
