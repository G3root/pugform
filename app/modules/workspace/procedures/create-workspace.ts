import { withAuthProcedure } from '~/trpc/init'
import { newId, shortId } from '~/utils/uuid'
import { WORKSPACE_PUBLIC_ID_LENGTH } from '../constants'
import { CreateWorkspaceSchema } from '../schema'

export const createWorkspaceProcedure = withAuthProcedure
	.input(CreateWorkspaceSchema)
	.mutation(async ({ ctx, input }) => {
		const organizationId = ctx.session.organizationId
		const membershipId = ctx.session.membershipId

		await ctx.db
			.insertInto('workspace')
			.values({
				organizationId,
				creatorId: membershipId,
				name: input.name,
				id: newId('workspace'),
				publicId: shortId(WORKSPACE_PUBLIC_ID_LENGTH),
			})
			.execute()

		return { message: 'Workspace created successfully!' }
	})
