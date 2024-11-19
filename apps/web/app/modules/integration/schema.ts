import { z } from 'zod'
import { FormIdSchema } from '../form/schema'

export const IntegrationIdsSchema = z.enum(['webhook'])

export type TIntegrationIds = z.infer<typeof IntegrationIdsSchema>

export const AddIntegrationSchema = z.object({
	formId: FormIdSchema,
	integrationId: IntegrationIdsSchema,
	config: z.record(z.any()),
})
