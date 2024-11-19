import { WebhookHandler } from './webhook'

export const handlers = {
	webhook: WebhookHandler,
} as const
