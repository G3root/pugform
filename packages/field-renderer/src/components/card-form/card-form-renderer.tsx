import type { NewField } from '@pugform/database'
import { createUniqueId } from 'solid-js'
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

export function CardFormFieldRenderer(props: CardFormFieldRendererProps) {
	const fieldId = createUniqueId()

	switch (props.type) {
		case 'SHORT_ANSWER':
			return (
				<FieldContainer>
					<Label id={fieldId} label={props.label} />
					<CardFormInput
						id={fieldId}
						name={props.id}
						required={props.required}
						type="text"
					/>
				</FieldContainer>
			)

		case 'EMAIL':
			return (
				<FieldContainer>
					<Label id={fieldId} label={props.label} />
					<CardFormInput
						id={fieldId}
						name={props.id}
						required={props.required}
						type="email"
					/>
				</FieldContainer>
			)

		case 'LONG_ANSWER':
			return (
				<FieldContainer>
					<Label id={fieldId} label={props.label} />
					<CardFormLongAnswerInput
						id={fieldId}
						name={props.id}
						required={props.required}
					/>
				</FieldContainer>
			)

		// case 'MULTIPLE_CHOICE':
		// 	return <CardFormMultipleChoiceInput options={options} label={props.label} />

		default:
			return null
	}
}
