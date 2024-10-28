type TFieldList = {
	label: string
} & Field

export const FIELD_LIST: TFieldList[] = [
	{ type: 'SHORT_ANSWER', label: 'Short Answer' },
	{ type: 'NUMBER', label: 'Number' },
	{ type: 'EMAIL', label: 'Email' },
	{
		type: 'LONG_ANSWER',
		label: 'Long Text',
	},
	{ type: 'DROPDOWN', label: 'Dropdown' },
	{
		type: 'CHECKBOX',
		label: 'Checkbox',
	},
	{ type: 'MULTIPLE_CHOICE', label: 'Multiple Choice' },
]
