import { z } from 'zod'
import type { Field } from '~/lib/db.server'
import { EmailSchema } from '~/utils/user-validation'

export function createFieldSchema(fields: Field[]) {
	const schemaShape: Record<string, z.ZodTypeAny> = {}

	for (const field of fields) {
		let fieldSchema: z.ZodTypeAny

		switch (field.type) {
			case 'EMAIL':
				fieldSchema = EmailSchema
				break
			case 'CHECKBOX':
				fieldSchema = z.coerce.boolean()
				break
			case 'MULTI_SELECT':
				fieldSchema = z.array(z.string())
				break

			default:
				fieldSchema = z.string().max(255)
		}

		schemaShape[field.id] = field.required
			? fieldSchema
			: fieldSchema.optional()
	}

	return z.object(schemaShape)
}
