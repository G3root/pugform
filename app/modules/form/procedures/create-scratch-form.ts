import { withAuthProcedure } from '~/trpc/init'
import { shortId } from '~/utils/uuid'
import { FORM_ID_LENGTH } from '../constants'
import { CreateScratchFormSchema } from '../schema'

export const createScratchFormProcedure = withAuthProcedure
	.input(CreateScratchFormSchema)
	.mutation(async ({ ctx, input }) => {
		const organizationId = ctx.session.organizationId
		const membershipId = ctx.session.membershipId

		const workspace = await ctx.db
			.selectFrom('workspace')
			.where('publicId', '=', input.workspacePublicId)
			.select(['id'])
			.executeTakeFirstOrThrow()

		const form = await ctx.db
			.insertInto('form')
			.values({
				creatorId: membershipId,
				organizationId,
				workspaceId: workspace.id,
				title: `Untitled ${input.layout === 'CARD' ? 'card' : 'classic'} form`,
				id: shortId(FORM_ID_LENGTH),
				layout: input.layout,
			})
			.returning(['id'])
			.executeTakeFirstOrThrow()

		return { message: 'form created successfully!', form }
	})
