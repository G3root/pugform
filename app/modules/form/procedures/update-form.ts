import { type NewField, type NewFormPage, db } from '~/lib/db.server'
import { withAuthProcedure } from '~/trpc/init'
import { UpdateFormSchema } from '../schema'

export const updateFormProcedure = withAuthProcedure
	.input(UpdateFormSchema)
	.mutation(async ({ ctx, input }) => {
		const organizationId = ctx.session.organizationId

		const form = await ctx.db
			.selectFrom('form')
			.where('id', '=', input.form.id)
			.where('organizationId', '=', organizationId)
			.select(['id'])
			.executeTakeFirstOrThrow()

		await ctx.db.deleteFrom('formPage').where('formId', '=', form.id).execute()

		const pages: NewFormPage[] = []

		const fields: NewField[] = []

		for (let index = 0; index < input.pages.length; index++) {
			const page = input.pages[index]

			pages.push({ formId: form.id, id: page.id, index, organizationId })

			for (let fieldIndex = 0; fieldIndex < page.fields.length; fieldIndex++) {
				const field = page.fields[fieldIndex]
				fields.push({
					...field,
					formPageId: page.id,
				})
			}
		}

		await db.insertInto('formPage').values(pages).execute()
		await db.insertInto('field').values(fields).execute()
	})
