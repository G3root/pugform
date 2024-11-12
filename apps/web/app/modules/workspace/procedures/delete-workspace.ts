import { withAuthProcedure } from '~/trpc/init'
import { DeleteWorkspaceSchema } from '../schema'

export const deleteWorkspaceProcedure = withAuthProcedure
	.input(DeleteWorkspaceSchema)
	.mutation(async ({ ctx, input }) => {
		const organizationId = ctx.session.organizationId
		const membershipId = ctx.session.membershipId

		await ctx.db
			.deleteFrom('workspace')
			.where('organizationId', '=', organizationId)
			.where('id', '=', input.id)
			.execute()

		return { message: 'Workspace deleted successfully!' }
	})
