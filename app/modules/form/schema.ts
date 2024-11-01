import { z } from 'zod'
import { FormLayout } from '~/generated/enums'
import { WorkspacePublicIdSchema } from '../workspace/schema'
import { FORM_ID_MAX_LENGTH, FORM_ID_MIN_LENGTH } from './constants'

export const CreateScratchFormSchema = z.object({
	workspacePublicId: WorkspacePublicIdSchema,
	layout: z.nativeEnum(FormLayout),
})

export const FormIdSchema = z
	.string()
	.min(FORM_ID_MIN_LENGTH)
	.max(FORM_ID_MAX_LENGTH)

export const GetFormSchema = z.object({
	formId: FormIdSchema,
})
