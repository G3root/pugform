import type { FieldType } from '~/generated/enums'

export const FIELD_LIST: { type: FieldType; label: string }[] = [
	{ type: 'SHORT_ANSWER', label: 'Short Answer' },
	{ type: 'NUMBER', label: 'Number' },
	{ type: 'EMAIL', label: 'Email' },
	{
		type: 'LONG_ANSWER',
		label: 'Long Text',
	},
	{ type: 'DROP_DOWN', label: 'Dropdown' },
	{
		type: 'CHECKBOX',
		label: 'Checkbox',
	},
	{ type: 'MULTIPLE_CHOICE', label: 'Multiple Choice' },
]

export const humanizedFieldType: Record<FieldType, string> = {
	CHECKBOX: 'Checkbox',
	DROP_DOWN: 'Dropdown',
	EMAIL: 'Email',
	LONG_ANSWER: 'Long Answer',
	MULTI_SELECT: 'Multi Select',
	MULTIPLE_CHOICE: 'Multiple Choice',
	NUMBER: 'Number',
	SHORT_ANSWER: 'Short Answer',
}
