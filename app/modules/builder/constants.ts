import type { Field } from '~/lib/db.server'

type TFieldList = Pick<Field, 'type' | 'label'>

export const FIELD_LIST: TFieldList[] = [
	{ type: 'SHORT_ANSWER', label: 'Short Answer' },
	{ type: 'NUMBER', label: 'Number' },
	{ type: 'EMAIL', label: 'Email' },
	{
		type: 'LONG_ANSWER',
		label: 'Long Text',
	},
	{ type: 'DROP_DOWN', label: 'Dropdown' },
	{
		type: 'CHECK_BOX',
		label: 'Checkbox',
	},
	{ type: 'MULTIPLE_CHOICE', label: 'Multiple Choice' },
]
