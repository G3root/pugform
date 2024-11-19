import type { z } from 'zod'
import type {
	IntegrationFormData,
	IntegrationHandlerContext,
	IntegrationMetadata,
	ProcessResult,
} from '../types'

export abstract class IntegrationHandler<
	T extends z.ZodTypeAny = z.ZodTypeAny,
	I = z.infer<T>,
> {
	abstract readonly metadata: IntegrationMetadata
	abstract readonly configSchema: T

	abstract testConnection(config: I): Promise<boolean>

	parseConfig(config: unknown): I {
		return this.configSchema.parse(config)
	}

	abstract process(options: {
		formData: IntegrationFormData
		config: I
		context: IntegrationHandlerContext
		integrationId: string
	}): Promise<ProcessResult>
}
