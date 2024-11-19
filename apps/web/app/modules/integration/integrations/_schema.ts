import { z } from 'zod'

export const WebhookConfigSchema = z.object({
	webhookUrl: z.string().url(),
	httpHeaders: z
		.array(z.object({ name: z.string(), value: z.string() }))
		.optional(),
	signingSecret: z.string().optional(),
})

export type TWebhookConfig = z.infer<typeof WebhookConfigSchema>
