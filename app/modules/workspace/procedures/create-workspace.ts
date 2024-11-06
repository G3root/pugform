import type { TKyselyDb } from '~/lib/db.server'
import { withAuthProcedure } from '~/trpc/init'
import { newId, shortId } from '~/utils/uuid'
import { WORKSPACE_PUBLIC_ID_LENGTH } from '../constants'
import { CreateWorkspaceSchema } from '../schema'

export const createWorkspaceProcedure = withAuthProcedure
	.input(CreateWorkspaceSchema)
	.mutation(async ({ ctx, input }) => {
		const organizationId = ctx.session.organizationId
		const membershipId = ctx.session.membershipId

		await createWorkSpaceHandler({
			db: ctx.db,
			membershipId,
			organizationId,
			name: input.name,
		})

		return { message: 'Workspace created successfully!' }
	})

interface createWorkSpaceHandlerOptions {
	membershipId: string
	organizationId: string
	name: string
	db: TKyselyDb
}

export async function createWorkSpaceHandler({
	db,
	membershipId,
	name,
	organizationId,
}: createWorkSpaceHandlerOptions) {
	await db
		.insertInto('workspace')
		.values({
			organizationId,
			creatorId: membershipId,
			name,
			id: newId('workspace'),
			publicId: shortId(WORKSPACE_PUBLIC_ID_LENGTH),
		})
		.execute()
}
