import { createServerValidate, formOptions } from '@tanstack/react-form/remix'
import { z } from 'zod'

export const CreateProjectSchema = z.object({
	name: z.string().min(1),
})
export const CreateProjectFormOptions = formOptions({
	defaultValues: {
		name: '',
	},
})

export const CreateProjectServerValidate = createServerValidate({
	...CreateProjectFormOptions,
	onServerValidate: CreateProjectSchema,
})
