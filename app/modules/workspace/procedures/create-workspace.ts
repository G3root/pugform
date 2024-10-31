import { withAuthProcedure } from '~/trpc/init'
import { newId, shortId } from '~/utils/uuid'
import { CreateWorkspaceSchema, workspacePublicIdLength } from '../schema'

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
				publicId: shortId(workspacePublicIdLength),
			})
			.execute()

		return { message: 'Workspace created successfully!' }
	})
