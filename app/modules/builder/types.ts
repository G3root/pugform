type FieldTypes =
	| 'SHORT_ANSWER'
	| 'NUMBER'
	| 'EMAIL'
	| 'LONG_ANSWER'
	| 'CHECKBOX'
	| 'MULTIPLE_CHOICE'
	| 'DROPDOWN'
	| 'MULTI_SELECT'

type Field = {
	type: FieldTypes
}
