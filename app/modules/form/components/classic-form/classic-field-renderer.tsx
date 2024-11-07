import { useListData } from 'react-stately'
import { Checkbox } from '~/components/ui/checkbox'
import {
	MultipleSelect,
	type SelectedKey,
} from '~/components/ui/multiple-select'
import { NumberField } from '~/components/ui/number-field'
import { Radio, RadioGroup } from '~/components/ui/radio'
import { Select } from '~/components/ui/select'
import { TextField } from '~/components/ui/text-field'
import { Textarea } from '~/components/ui/textarea'
import type { FieldType } from '~/generated/enums'

interface ClassicFieldRendererProps {
	type: FieldType
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
	const optionList = options.map((item, index) => ({ id: index, name: item }))
	const selectedItems = useListData<SelectedKey>({
		initialItems: [],
	})

	switch (type) {
		case 'SHORT_ANSWER':
			return <TextField label={label} isRequired={required} name={id} />

		case 'LONG_ANSWER':
			return <Textarea label={label} isRequired={required} name={id} />

		case 'EMAIL':
			return (
				<TextField label={label} isRequired={required} name={id} type="email" />
			)

		case 'NUMBER':
			return <NumberField label={label} isRequired={required} name={id} />

		case 'CHECKBOX':
			return <Checkbox label={label} isRequired={required} name={id} />

		case 'DROP_DOWN':
			return (
				<Select label={label} isRequired={required} name={id}>
					<Select.Trigger />
					<Select.List items={optionList}>
						{(item) => (
							<Select.Option id={item.id} textValue={item.name}>
								{item.name}
							</Select.Option>
						)}
					</Select.List>
				</Select>
			)

		case 'MULTI_SELECT':
			return (
				<MultipleSelect
					className="max-w-xs"
					label={label}
					isRequired={required}
					name={id}
					selectedItems={selectedItems}
					items={optionList}
					tag={(item) => (
						<MultipleSelect.Tag textValue={item.name}>
							{item.name}
						</MultipleSelect.Tag>
					)}
				>
					{(item) => {
						return (
							<MultipleSelect.Option textValue={item.name}>
								{item.name}
							</MultipleSelect.Option>
						)
					}}
				</MultipleSelect>
			)

		case 'MULTIPLE_CHOICE':
			return (
				<RadioGroup label={label} isRequired={required} name={id}>
					{optionList.map((item) => (
						<Radio key={item.id} value={item.name}>
							{item.name}
						</Radio>
					))}
				</RadioGroup>
			)

		default:
			return null
	}
}
