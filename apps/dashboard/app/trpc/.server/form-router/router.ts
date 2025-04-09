import { router } from '../trpc'
import { createFormProcedure } from './procedures/create-form'

export const formRouter = router({
	createForm: createFormProcedure,
})
