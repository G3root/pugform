import { FieldType, FormLayout, FormStatus } from '@pugform/database/enums'
import { z } from 'zod'
import { WorkspacePublicIdSchema } from '../workspace/schema'
import { FORM_ID_MAX_LENGTH, FORM_ID_MIN_LENGTH } from './constants'

export const CreateScratchFormSchema = z.object({
	workspacePublicId: WorkspacePublicIdSchema,
	layout: z.nativeEnum(FormLayout),
})

export const FormIdSchema = z
	.string()
	.min(FORM_ID_MIN_LENGTH)
	.max(FORM_ID_MAX_LENGTH)

export const DeleteFormSchema = z.object({
	formId: FormIdSchema,
})

export const GetFormSchema = z.object({
	formId: FormIdSchema,
})

export const GetFormResponse = z.object({
	formId: FormIdSchema,
})

export const RenameFormSchema = z.object({
	formId: FormIdSchema,
	title: z.string().max(100),
})

export const UpdateFormSchema = z.object({
	form: z.object({
		id: FormIdSchema,
		status: z.nativeEnum(FormStatus),
	}),

	pages: z.array(
		z.object({
			id: z.string(),
			fields: z.array(
				z.object({
					label: z.string(),
					type: z.nativeEnum(FieldType),
					id: z.string(),
					required: z.coerce.boolean(),
					description: z.string().nullish(),
					placeholder: z.string().nullish(),
					options: z.array(z.string()),
				}),
			),
		}),
	),
})

export type TUpdateFormSchema = z.infer<typeof UpdateFormSchema>
