import { TextField } from '~/components/ui/text-field'
import { Textarea } from '~/components/ui/textarea'
import type { FieldType } from '~/generated/enums'

interface ClassicFieldRendererProps {
	type: FieldType
	label: string
	id: string
	required: boolean
}

export function ClassicFieldRenderer({
	type,
	label,
	id,
	required,
}: ClassicFieldRendererProps) {
	switch (type) {
		case 'SHORT_ANSWER':
			return <TextField label={label} isRequired={required} name={id} />

		case 'LONG_ANSWER':
			return <Textarea label={label} isRequired={required} name={id} />

		default:
			return null
	}
}
