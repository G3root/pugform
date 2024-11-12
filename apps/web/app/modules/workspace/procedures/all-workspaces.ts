import { withAuthProcedure } from '~/trpc/init'

export const AllWorkspacesProcedure = withAuthProcedure.query(
	async ({ ctx }) => {
		const organizationId = ctx.session.organizationId

		const workspaces = await ctx.db
			.selectFrom('workspace')
			.where('organizationId', '=', organizationId)
			.select(['name', 'id', 'createdAt', 'publicId'])
			.orderBy('createdAt', 'desc')
			.execute()

		return { workspaces }
	},
)
