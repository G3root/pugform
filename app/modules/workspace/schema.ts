import { z } from 'zod'

export const CreateWorkspaceSchema = z.object({
	name: z.string().max(70),
})
