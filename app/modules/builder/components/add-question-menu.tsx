import { useFormMetadata } from '@conform-to/react'
import { IconPlus } from 'justd-icons'
import { Button } from '~/components/ui/button'
import { Menu } from '~/components/ui/menu'
import { Tooltip } from '~/components/ui/tooltip'
import { newId } from '~/utils/uuid'
import { FIELD_LIST } from '../constants'
import type { useBuilderForm } from '../hooks/use-builder-form'

interface AddQuestionMenuProps {
	formPageId: string
	formId: ReturnType<typeof useBuilderForm>[2]
}

export function AddQuestionMenu({ formPageId, formId }: AddQuestionMenuProps) {
	const form = useFormMetadata(formId)

	const field = form.getFieldset().fields.getFieldset()[formPageId]

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
							form.insert({
								name: field.name,
								defaultValue: {
									type: item.type,
									label: getLabel(),
									id: newId('field'),
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
