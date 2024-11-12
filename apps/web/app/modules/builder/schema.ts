import { z } from 'zod'
import { FieldType } from '~/generated/enums'

export const FieldSchema = z.object({
	id: z.string(),
	type: z.nativeEnum(FieldType),
	label: z.string(),
	required: z.coerce.boolean(),
	placeholder: z.string().optional(),
	description: z.string().optional(),
})

export type TFieldSchema = z.infer<typeof FieldSchema>

export const CreateFormSchema = z.object({
	fieldPages: z.array(z.string()),
	fields: z.record(z.array(FieldSchema)),
})

export type TCreateFormSchema = z.infer<typeof CreateFormSchema>
