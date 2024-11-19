import type { FieldType } from '@pugform/database/enums'

export interface IntegrationMetadata {
	name: string
	description: string
}

export type IntegrationFormData = {
	id: string
	formId: string
	formName: string
	responses: {
		id: string
		question: string
		type: FieldType
		answer: string
	}[]
	timeStamp: string
}

export interface IntegrationHandlerContext {
	formId: string
	responseId: string
	organizationId: string
}

export interface ProcessResult {
	success: boolean
	error?: Error
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	metadata?: Record<string, any>
	formId: string
	integrationId: string
	organizationId: string
	responseId: string
}
