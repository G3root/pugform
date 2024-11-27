import type { NewField } from '@pugform/database'
import { useId } from 'preact/hooks'
import { Label } from '../common/label'

interface CardFormRendererProps {
	type: NewField['type']
	label: string
	id: string
	required: boolean
	options: string[]
}

export function CardFormRenderer({
	type,
	label,
	id,
	required,
	options,
}: CardFormRendererProps) {
	const fieldId = useId()

	switch (type) {
		case 'SHORT_ANSWER':
			return (
				<div>
					<Label id={fieldId} label={label} />
					<input type="text" />
				</div>
			)

		case 'EMAIL':
			return (
				<div>
					<Label id={fieldId} label={label} />
					<input type="text" />
				</div>
			)

		case 'LONG_ANSWER':
			return (
				<div>
					<Label id={fieldId} label={label} />
					<input type="text" />
				</div>
			)

		default:
			return null
	}
}
