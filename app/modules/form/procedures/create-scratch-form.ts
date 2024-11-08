import { withAuthProcedure } from '~/trpc/init'
import { newId, shortId } from '~/utils/uuid'
import { FORM_ID_LENGTH } from '../constants'
import { CreateScratchFormSchema } from '../schema'

export const createScratchFormProcedure = withAuthProcedure
	.input(CreateScratchFormSchema)
	.mutation(async ({ ctx, input }) => {
		const organizationId = ctx.session.organizationId
		const membershipId = ctx.session.membershipId

		const form = await ctx.db.transaction().execute(async (trx) => {
			const workspace = await trx
				.selectFrom('workspace')
				.where('publicId', '=', input.workspacePublicId)
				.select(['id'])
				.executeTakeFirstOrThrow()

			const form = await trx
				.insertInto('form')
				.values({
					creatorId: membershipId,
					organizationId,
					workspaceId: workspace.id,
					title: `Untitled ${input.layout === 'CARD' ? 'card' : 'classic'} form`,
					id: shortId(FORM_ID_LENGTH),
					layout: input.layout,
					createdAt: new Date(),
					updatedAt: new Date(),
				})
				.returning(['id'])
				.executeTakeFirstOrThrow()

			await trx
				.insertInto('formPage')
				.values({
					organizationId,
					formId: form.id,
					id: newId('page'),
					index: 0,
					createdAt: new Date(),
					updatedAt: new Date(),
				})
				.execute()

			return form
		})

		return { message: 'form created successfully!', form }
	})
