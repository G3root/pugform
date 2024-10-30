import { withAuthProcedure } from '~/trpc/init'
import { newId } from '~/utils/uuid'
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
			})
			.execute()

		return { message: 'Workspace created successfully!' }
	})
