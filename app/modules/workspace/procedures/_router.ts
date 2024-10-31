import { createTRPCRouter } from '~/trpc/init'
import { AllWorkspacesProcedure } from './all-workspaces'
import { createWorkspaceProcedure } from './create-workspace'
import { deleteWorkspaceProcedure } from './delete-workspace'

export const workspaceRouter = createTRPCRouter({
	create: createWorkspaceProcedure,
	all: AllWorkspacesProcedure,
	delete: deleteWorkspaceProcedure,
})
