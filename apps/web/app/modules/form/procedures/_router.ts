import { createTRPCRouter } from '~/trpc/init'
import { addSubmissionProcedure } from './add-submission'
import { allFormProcedure } from './all-form'
import { createScratchFormProcedure } from './create-scratch-form'
import { deleteFormProcedure } from './delete-form'
import { getFormProcedure } from './get-Form'
import { getFormPublicProcedure } from './get-from-public'
import { getResponsesProcedure } from './get-responses'
import { renameFormProcedure } from './rename-form'
import { updateFormProcedure } from './update-form'

export const formRouter = createTRPCRouter({
	createScratchForm: createScratchFormProcedure,
	get: getFormProcedure,
	getPublic: getFormPublicProcedure,
	delete: deleteFormProcedure,
	rename: renameFormProcedure,
	update: updateFormProcedure,
	addSubmission: addSubmissionProcedure,
	responses: getResponsesProcedure,
	all: allFormProcedure,
})
