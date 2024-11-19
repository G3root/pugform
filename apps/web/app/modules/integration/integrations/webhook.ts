import type {
	IntegrationFormData,
	IntegrationHandlerContext,
	ProcessResult,
} from '../types'
import { IntegrationHandler } from './_base'
import { type TWebhookConfig, WebhookConfigSchema } from './_schema'

export class WebhookHandler extends IntegrationHandler<
	typeof WebhookConfigSchema
> {
	readonly metadata = {
		name: 'Webhook',
		description:
			'Send form responses to external apps instantly for seamless automation.',
	}
	readonly configSchema = WebhookConfigSchema

	async validate(config: TWebhookConfig): Promise<boolean> {
		try {
			const response = await fetch(config.webhookUrl)
			return response.ok
		} catch {
			return false
		}
	}

	async testConnection(config: TWebhookConfig) {
		return this.validate(config)
	}

	async process({
		config,
		context,
		integrationId,
		formData,
	}: {
		integrationId: string
		formData: IntegrationFormData
		config: TWebhookConfig
		context: IntegrationHandlerContext
	}): Promise<ProcessResult> {
		try {
			const response = await fetch(config.webhookUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			})
			return {
				success: response.ok,
				metadata: {
					statusCode: response.status,
					responseBody: await response.json(),
				},
				integrationId,
				formId: context.formId,
				organizationId: context.organizationId,
				responseId: context.responseId,
			}
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			return {
				success: false,
				error: new Error(`Webhook integration error: ${error?.message}`),
				integrationId,
				formId: context.formId,
				organizationId: context.organizationId,
				responseId: context.responseId,
			}
		}
	}
}
