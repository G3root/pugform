import { z } from 'zod'
import { FormLayout } from '~/generated/enums'
import { WorkspacePublicIdSchema } from '../workspace/schema'

export const CreateScratchFormSchema = z.object({
	workspacePublicId: WorkspacePublicIdSchema,
	layout: z.nativeEnum(FormLayout),
})
