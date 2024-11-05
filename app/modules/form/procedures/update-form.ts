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
			const [form, existingPages] = await Promise.all([
				getForm(trx, input.form.id, organizationId),
				getExistingPages(trx, organizationId, input.form.id),
			])

			const { deletedPageIds, createdPages, updatedFields } = processFormUpdate(
				form.id,
				organizationId,
				input.pages,
				existingPages,
			)

			await Promise.all([
				deleteFields(trx, getFieldsToDelete(updatedFields, deletedPageIds)),
				deletePages(trx, Array.from(deletedPageIds)),
				createPages(trx, createdPages),
				upsertFields(trx, updatedFields),
			])
		})
	})

async function getForm(
	db: TKyselyDb,
	formId: string,
	organizationId: string,
): Promise<{ id: string }> {
	return db
		.selectFrom('form')
		.where('id', '=', formId)
		.where('organizationId', '=', organizationId)
		.select(['id'])
		.executeTakeFirstOrThrow()
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

async function getExistingPages(
	db: TKyselyDb,
	organizationId: string,
	formId: string,
) {
	return db
		.selectFrom('formPage')
		.where('organizationId', '=', organizationId)
		.where('formId', '=', formId)
		.select(['id'])
		.execute()
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
	updatedFields: NewField[],
	deletedPageIds: Set<string>,
): string[] {
	return updatedFields
		.filter((field) => deletedPageIds.has(field.formPageId))
		.map((field) => field.id)
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
	return new Set([...set1].filter((x) => !set2.has(x)))
}
