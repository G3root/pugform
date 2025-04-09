import { z } from 'zod'

export const CreateFormSchema = z.object({
	name: z.string(),
	projectPublicId: z.string(),
	description: z.string().optional(),
})
