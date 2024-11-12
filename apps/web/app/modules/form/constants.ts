import type { FieldType } from '~/generated/enums'

export const FORM_ID_LENGTH = 9
export const FORM_ID_MAX_LENGTH = FORM_ID_LENGTH
export const FORM_ID_MIN_LENGTH = 9

export const FIELDS_WITH_OPTIONS: FieldType[] = [
	'MULTIPLE_CHOICE',
	'MULTI_SELECT',
	'DROP_DOWN',
]
