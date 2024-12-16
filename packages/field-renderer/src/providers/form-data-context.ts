import type { FieldType, FormLayout } from '@pugform/database/enums'
import { createContext } from 'solid-js'

export type TField = {
	options: string[]
	type: FieldType
	formId: string
	id: string
	index: number
	organizationId: string
	createdAt: Date
	updatedAt: Date
	description: string | null
	label: string
	placeholder: string | null
	required: boolean
	order: number
	formPageId: string
}

export type TPage = {
	id: string
	fields: TField[]
}

// export interface TFormDataContext {
// 	id: string
// 	status: FormStatus
// 	title: string
// 	layout: FormLayout
// 	totalPages: number
// 	pages: undefined | TPage[]
// 	fields: undefined | TField[]
// }

export interface TFormData {
	id: string
	layout: FormLayout
	totalPages: number
	fields: undefined | TField[]
	pages: undefined | TPage[]
}

export const FormDataContext = createContext<TFormData>()
