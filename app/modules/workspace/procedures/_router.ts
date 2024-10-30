import { createTRPCRouter } from '~/trpc/init'
import { createWorkspaceProcedure } from './create-workspace'

export const workspaceRouter = createTRPCRouter({
	createWorkspace: createWorkspaceProcedure,
})
