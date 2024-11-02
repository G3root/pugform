import { jsonArrayFrom } from 'kysely/helpers/postgres'
import { withAuthProcedure } from '~/trpc/init'
import { WorkspaceByPublicIdSchema } from '../schema'

export const workspaceByPublicIdProcedure = withAuthProcedure
	.input(WorkspaceByPublicIdSchema)
	.mutation(async ({ ctx, input }) => {
		const organizationId = ctx.session.organizationId

		const workspace = await ctx.db
			.selectFrom('workspace as w')
			.where('organizationId', '=', organizationId)
			.where('publicId', '=', input.publicId)
			.select((eb) => [
				jsonArrayFrom(
					eb
						.selectFrom('form as f')
						.select(['f.title', 'f.id', 'f.isActive'])
						.whereRef('f.workspaceId', '=', 'w.id'),
				).as('forms'),
			])
			.select(['id', 'name'])
			.executeTakeFirstOrThrow()

		return { workspace }
	})
