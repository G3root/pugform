import { z } from 'zod'

export const CreateProjectSchema = z.object({
	name: z.string().min(1),
})
