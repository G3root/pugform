import type { NewField } from '@pugform/database'
import { useId } from 'preact/hooks'
import { FieldContainer } from '../common/field-container'
import { Label } from '../common/label'

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
					<input className="pf-classic-input-field" type="text" />
				</FieldContainer>
			)

		case 'EMAIL':
			return (
				<FieldContainer>
					<Label id={fieldId} label={label} />
					<input className="pf-classic-input-field" type="text" />
				</FieldContainer>
			)

		case 'LONG_ANSWER':
			return (
				<FieldContainer>
					<Label id={fieldId} label={label} />
					<input className="pf-classic-input-field" type="text" />
				</FieldContainer>
			)

		default:
			return null
	}
}
