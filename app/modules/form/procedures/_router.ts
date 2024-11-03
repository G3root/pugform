import { createTRPCRouter } from '~/trpc/init'
import { createScratchFormProcedure } from './create-scratch-form'
import { deleteFormProcedure } from './delete-form'
import { getFormProcedure } from './get-Form'
import { renameFormProcedure } from './rename-form'

export const formRouter = createTRPCRouter({
	createScratchForm: createScratchFormProcedure,
	get: getFormProcedure,
	delete: deleteFormProcedure,
	rename: renameFormProcedure,
})
