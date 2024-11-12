import { useFormMetadata } from '@conform-to/react'
import { IconPlus } from 'justd-icons'
import { Button } from '~/components/ui/button'
import { Menu } from '~/components/ui/menu'
import { Tooltip } from '~/components/ui/tooltip'
import { FIELDS_WITH_OPTIONS } from '~/modules/form/constants'
import { newId } from '~/utils/uuid'
import type { useBuilderForm } from '../../form/hooks/use-builder-form'
import { FIELD_LIST } from '../constants'

interface AddQuestionMenuProps {
	formPageIndex: number
	formId: ReturnType<typeof useBuilderForm>[2]
}

export function AddQuestionMenu({
	formPageIndex,
	formId,
}: AddQuestionMenuProps) {
	const form = useFormMetadata(formId)

	const field = form
		.getFieldset()
		.pages.getFieldList()
		[formPageIndex].getFieldset().fields

	const getLabel = () => {
		const fieldList = field.getFieldList()

		return `field ${fieldList.length + 1}`
	}

	return (
		<Menu>
			<Tooltip>
				<Button
					aria-label="add question"
					shape="circle"
					intent="primary"
					size="square-petite"
				>
					<IconPlus aria-hidden />
				</Button>
				<Tooltip.Content>Add question</Tooltip.Content>
			</Tooltip>
			<Menu.Content>
				{FIELD_LIST.map((item) => (
					<Menu.Item
						onAction={() => {
							const isFieldWithOptions = FIELDS_WITH_OPTIONS.includes(item.type)

							form.insert({
								name: field.name,
								defaultValue: {
									type: item.type,
									label: getLabel(),
									id: newId('field'),
									...(isFieldWithOptions && {
										options: [''],
									}),
								},
							})
						}}
						key={item.label}
					>
						{item.label}
					</Menu.Item>
				))}
			</Menu.Content>
		</Menu>
	)
}
