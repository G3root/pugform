import type { NewField } from '@pugform/database'
import { useId } from 'preact/hooks'
import { FieldContainer } from '../common/field-container'
import { Label } from '../common/label'
import { CardFormInput } from './input'
import { CardFormLongAnswerInput } from './long-answer-input'

interface CardFormFieldRendererProps {
	type: NewField['type']
	label: string
	id: string
	required: boolean
	options: string[]
}

export function CardFormFieldRenderer({
	type,
	label,
	id,
	required,
	options,
}: CardFormFieldRendererProps) {
	const fieldId = useId()

	switch (type) {
		case 'SHORT_ANSWER':
			return (
				<FieldContainer>
					<Label id={fieldId} label={label} />
					<CardFormInput type="text" />
				</FieldContainer>
			)

		case 'EMAIL':
			return (
				<FieldContainer>
					<Label id={fieldId} label={label} />
					<CardFormInput type="text" />
				</FieldContainer>
			)

		case 'LONG_ANSWER':
			return (
				<FieldContainer>
					<Label id={fieldId} label={label} />
					<CardFormLongAnswerInput />
				</FieldContainer>
			)

		default:
			return null
	}
}
