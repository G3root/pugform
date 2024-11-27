import type { FieldType, FormLayout, FormStatus } from '@pugform/database/enums'
import { type ComponentChildren, createContext } from 'preact'
import { useContext } from 'preact/hooks'

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

export interface TFormDataContext {
	status: FormStatus
	title: string
	layout: FormLayout
	totalPages: number
	pages: undefined | TPage[]
	fields: undefined | TField[]
}

const Context = createContext<TFormDataContext | null>(null)

export function FormDataProvider({
	children,
	...rest
}: TFormDataContext & { children: ComponentChildren }) {
	return <Context.Provider value={rest}>{children}</Context.Provider>
}

export const useFormData = () => {
	const data = useContext(Context)

	if (!data) {
		throw new Error('use useFormData inside <FormDataProvider />')
	}

	return data
}
