import type { NewField } from '@pugform/database'
import { useId } from 'preact/hooks'
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

export function ClassicFieldRenderer({
	type,
	label,
	id,
	required,
	options,
}: ClassicFieldRendererProps) {
	const fieldId = useId()

	switch (type) {
		case 'SHORT_ANSWER':
			return (
				<FieldContainer>
					<Label id={fieldId} label={label} />
					<ClassicFormInput type="text" />
				</FieldContainer>
			)

		case 'EMAIL':
			return (
				<FieldContainer>
					<Label id={fieldId} label={label} />
					<ClassicFormInput type="email" />
				</FieldContainer>
			)

		case 'LONG_ANSWER':
			return (
				<FieldContainer>
					<Label id={fieldId} label={label} />
					<ClassicFormLongAnswerInput />
				</FieldContainer>
			)

		default:
			return null
	}
}
