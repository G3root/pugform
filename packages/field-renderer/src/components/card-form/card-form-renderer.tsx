import type { NewField } from '@pugform/database'
import { useId } from 'preact/hooks'
import { FieldContainer } from '../common/field-container'
import { Label } from '../common/label'
import { CardFormInput } from './input'
import { CardFormLongAnswerInput } from './long-answer-input'
import { CardFormMultipleChoiceInput } from './multiple-choice-input'

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
					<CardFormInput
						id={fieldId}
						name={id}
						required={required}
						type="text"
					/>
				</FieldContainer>
			)

		case 'EMAIL':
			return (
				<FieldContainer>
					<Label id={fieldId} label={label} />
					<CardFormInput
						id={fieldId}
						name={id}
						required={required}
						type="email"
					/>
				</FieldContainer>
			)

		case 'LONG_ANSWER':
			return (
				<FieldContainer>
					<Label id={fieldId} label={label} />
					<CardFormLongAnswerInput id={fieldId} name={id} required={required} />
				</FieldContainer>
			)

		case 'MULTIPLE_CHOICE':
			return <CardFormMultipleChoiceInput options={options} label={label} />

		default:
			return null
	}
}
