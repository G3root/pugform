import { createTRPCRouter } from '~/trpc/init'
import { AllWorkspacesProcedure } from './all-workspaces'
import { createWorkspaceProcedure } from './create-workspace'
import { deleteWorkspaceProcedure } from './delete-workspace'
import { workspaceByPublicIdProcedure } from './workspace-by-publicId'

export const workspaceRouter = createTRPCRouter({
	create: createWorkspaceProcedure,
	all: AllWorkspacesProcedure,
	delete: deleteWorkspaceProcedure,
	getByPublicId: workspaceByPublicIdProcedure,
})
