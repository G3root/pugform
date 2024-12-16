import type { NewField } from '@pugform/database'
import { createUniqueId } from 'solid-js'
import { FieldContainer } from '../common/field-container'
import { Label } from '../common/label'
import { ClassicFormInput } from './input'
import { ClassicFormLongAnswerInput } from './long-answer-Input'

interface ClassicFieldRendererProps {
	type: NewField['type']
	label: string
	id: string
	required: boolean
	options: string[]
}

export function ClassicFieldRenderer(props: ClassicFieldRendererProps) {
	const fieldId = createUniqueId()

	switch (props.type) {
		case 'SHORT_ANSWER':
			return (
				<FieldContainer>
					<Label id={fieldId} label={props.label} />
					<ClassicFormInput
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
					<ClassicFormInput
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

					<ClassicFormLongAnswerInput
						id={fieldId}
						name={props.id}
						required={props.required}
					/>
				</FieldContainer>
			)

		default:
			return null
	}
}
