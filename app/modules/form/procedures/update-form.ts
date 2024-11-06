import type { Field, NewField, NewFormPage, TKyselyDb } from '~/lib/db.server'
import { withAuthProcedure } from '~/trpc/init'
import { type TUpdateFormSchema, UpdateFormSchema } from '../schema'

const fieldKeys: Record<keyof Field, string> = {
	createdAt: '',
	description: '',
	type: '',
	required: '',
	placeholder: '',
	updatedAt: '',
	options: '',
	order: '',
	formId: '',
	formPageId: '',
	id: '',
	label: '',
}

export const updateFormProcedure = withAuthProcedure
	.input(UpdateFormSchema)
	.mutation(async ({ ctx, input }) => {
		const organizationId = ctx.session.organizationId

		await ctx.db.transaction().execute(async (trx) => {
			const {
				form,
				pages: existingPages,
				fields: existingFields,
			} = await getFormData(trx, input.form.id, organizationId)

			const { deletedPageIds, createdPages, updatedFields } = processFormUpdate(
				form.id,
				organizationId,
				input.pages,
				existingPages,
			)

			const fieldsToDelete = getFieldsToDelete(
				existingFields,
				updatedFields,
				deletedPageIds,
			)

			await Promise.all([
				deleteFields(trx, fieldsToDelete),
				deletePages(trx, Array.from(deletedPageIds)),
				createPages(trx, createdPages),
				upsertFields(trx, updatedFields),
			])
		})
	})

async function getFormData(
	db: TKyselyDb,
	formId: string,
	organizationId: string,
) {
	const [form, pages, fields] = await Promise.all([
		db
			.selectFrom('form')
			.where('id', '=', formId)
			.where('organizationId', '=', organizationId)
			.select(['id'])
			.executeTakeFirstOrThrow(),

		db
			.selectFrom('formPage')
			.where('formId', '=', formId)
			.where('organizationId', '=', organizationId)
			.select(['id'])
			.execute(),

		db
			.selectFrom('field')
			.where('formId', '=', formId)
			.select(['id', 'formPageId'])
			.execute(),
	])

	return { form, pages, fields }
}

function processFormUpdate(
	formId: string,
	organizationId: string,
	inputPages: TUpdateFormSchema['pages'],
	existingPages: { id: string }[],
) {
	const existingPageIds = new Set(existingPages.map((p) => p.id))
	const inputPageIds = new Set(inputPages.map((p) => p.id))

	return {
		deletedPageIds: difference(existingPageIds, inputPageIds),
		createdPages: getCreatedPages(
			inputPages,
			existingPageIds,
			formId,
			organizationId,
		),
		updatedFields: getUpdatedFields(inputPages, formId),
	}
}

function getCreatedPages(
	inputPages: TUpdateFormSchema['pages'],
	existingPageIds: Set<string>,
	formId: string,
	organizationId: string,
): NewFormPage[] {
	return inputPages
		.filter((p) => !existingPageIds.has(p.id))
		.map((p, index) => ({
			formId,
			id: p.id,
			organizationId,
			index,
		}))
}

function getUpdatedFields(
	inputPages: TUpdateFormSchema['pages'],
	formId: string,
): NewField[] {
	return inputPages.flatMap(({ id: pageId, fields }, pageIndex) =>
		fields.map((field, fieldIndex) => ({
			...field,
			formPageId: pageId,
			formId,
			order: fieldIndex,
		})),
	)
}

function getFieldsToDelete(
	existingFields: { id: string; formPageId: string }[],
	updatedFields: NewField[],
	deletedPageIds: Set<string>,
): string[] {
	const idsToDelete: string[] = []
	const updatedFieldIds = new Set(updatedFields.map((item) => item.id))

	for (const field of existingFields) {
		if (
			!updatedFieldIds.has(field.id) ||
			deletedPageIds.has(field.formPageId)
		) {
			idsToDelete.push(field.id)
		}
	}

	return idsToDelete
}

async function deleteFields(db: TKyselyDb, fieldIds: string[]) {
	if (!fieldIds.length) return

	await db.deleteFrom('field').where('id', 'in', fieldIds).execute()
}
async function deletePages(db: TKyselyDb, pageIds: string[]) {
	if (!pageIds.length) return

	await db.deleteFrom('formPage').where('id', 'in', pageIds).execute()
}

async function createPages(db: TKyselyDb, pages: NewFormPage[]) {
	if (!pages.length) return

	await db.insertInto('formPage').values(pages).execute()
}
async function upsertFields(db: TKyselyDb, fields: NewField[]) {
	if (!fields.length) return
	await db
		.insertInto('field')
		.values(fields)
		.onConflict((oc) =>
			oc.column('id').doUpdateSet((eb) => {
				const keys = Object.keys(fieldKeys) as (keyof Field)[]
				return Object.fromEntries(
					keys.map((key) => [key, eb.ref(`excluded.${key}`)]),
				)
			}),
		)
		.execute()
}

function difference<T>(set1: Set<T>, set2: Set<T>): Set<T> {
	const result = new Set<T>()
	for (const item of set1) {
		if (!set2.has(item)) {
			result.add(item)
		}
	}
	return result
}
