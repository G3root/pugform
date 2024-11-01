import { createTRPCRouter } from '~/trpc/init'
import { createScratchFormProcedure } from './create-scratch-form'
import { getFormProcedure } from './get-Form'

export const formRouter = createTRPCRouter({
	createScratchForm: createScratchFormProcedure,
	get: getFormProcedure,
})
