import type { Field, FieldUpdate, NewField, NewFormPage } from '~/lib/db.server'
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

		const existingPages = await ctx.db
			.selectFrom('formPage')
			.where('organizationId', '=', organizationId)
			.where('formId', '=', form.id)
			.select('id')
			.execute()

		const currentFormFields = await ctx.db
			.selectFrom('field')
			.where('formId', '=', form.id)
			.select(['id', 'formPageId'])
			.execute()

		// Preprocess existing and new page IDs
		const newPagesId = new Set(input.pages.map((page) => page.id))
		const existingPagesId = new Set(existingPages.map((page) => page.id))

		// Prepare pages and fields for insertion and deletion
		const pagesToCreate: NewFormPage[] = []
		const pagesToDelete = new Set<string>()
		const fieldsToDelete: string[] = []
		const fieldsToCreate: NewField[] = []

		// Determine pages to delete and fields associated with those pages
		for (const pageId of existingPagesId) {
			if (!newPagesId.has(pageId)) {
				pagesToDelete.add(pageId)
			}
		}

		for (const field of currentFormFields) {
			if (pagesToDelete.has(field.formPageId)) {
				fieldsToDelete.push(field.id)
			}
		}

		// Populate pages and fields to create based on input
		for (const [index, page] of input.pages.entries()) {
			if (!existingPagesId.has(page.id)) {
				pagesToCreate.push({
					formId: form.id,
					id: page.id,
					organizationId,
					index,
				})
			}

			if (!pagesToDelete.has(page.id)) {
				page.fields.forEach((field, fieldIndex) => {
					fieldsToCreate.push({
						...field,
						formPageId: page.id,
						formId: form.id,
						order: fieldIndex,
					})
				})
			}
		}

		// Batch delete fields if necessary
		if (fieldsToDelete.length > 0) {
			await ctx.db
				.deleteFrom('field')
				.where('id', 'in', fieldsToDelete)
				.execute()
		}

		// Batch delete pages if necessary
		if (pagesToDelete.size > 0) {
			await ctx.db
				.deleteFrom('formPage')
				.where('id', 'in', Array.from(pagesToDelete))
				.execute()
		}

		// Batch insert pages if necessary
		if (pagesToCreate.length > 0) {
			await ctx.db.insertInto('formPage').values(pagesToCreate).execute()
		}

		// Batch insert fields with conflict resolution
		if (fieldsToCreate.length > 0) {
			await ctx.db
				.insertInto('field')
				.values(fieldsToCreate)
				.onConflict((oc) =>
					oc.column('id').doUpdateSet((eb) => {
						const keys = Object.keys(fieldsToCreate[0]) as (keyof Field)[]
						const definedEntries = keys
							.filter((key) => fieldsToCreate[0][key] !== undefined)
							.map((key) => [key, eb.ref(`excluded.${key}`)])

						return Object.fromEntries(definedEntries)
					}),
				)
				.execute()
		}
	})
