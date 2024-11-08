import { useListData } from 'react-stately'
import { Checkbox } from '~/components/ui/checkbox'
import { Input, InputPrimitive, Label } from '~/components/ui/field'
import {
	MultipleSelect,
	type SelectedKey,
} from '~/components/ui/multiple-select'
import { NumberField } from '~/components/ui/number-field'
import { Radio, RadioGroup } from '~/components/ui/radio'
import { Select } from '~/components/ui/select'
import { TextField, TextFieldPrimitive } from '~/components/ui/text-field'
import { Textarea } from '~/components/ui/textarea'
import type { FieldType } from '~/generated/enums'

interface CardFormFieldRendererProps {
	type: FieldType
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
	const optionList = options.map((item, index) => ({ id: index, name: item }))
	const selectedItems = useListData<SelectedKey>({
		initialItems: [],
	})

	switch (type) {
		case 'SHORT_ANSWER':
			return (
				<TextFieldPrimitive
					isRequired={required}
					name={id}
					className="group flex flex-col gap-2"
				>
					<Label className="text-3xl sm:text-4xl font-bold leading-tight">
						{label}
					</Label>

					<InputPrimitive className="text-xl sm:text-2xl focus:border-primary border-input  border-b-2 bg-transparent focus:outline-none transition forced-colors:bg-[Field]" />
				</TextFieldPrimitive>
			)

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
