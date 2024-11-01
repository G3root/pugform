import { createTRPCRouter } from '~/trpc/init'
import { createScratchFormProcedure } from './create-scratch-form'

export const formRouter = createTRPCRouter({
	createScratchForm: createScratchFormProcedure,
})
