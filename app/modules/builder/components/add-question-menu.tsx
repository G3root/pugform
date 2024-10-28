import { IconPlus } from 'justd-icons'
import { Button } from '~/components/ui/button'
import { Menu } from '~/components/ui/menu'
import { Tooltip } from '~/components/ui/tooltip'
import { newId } from '~/utils/uuid'
import { FIELD_LIST } from '../constants'
import { useBuilderStore } from '../providers/builder-store-provider'

interface AddQuestionMenuProps {
	formPageId: string
}

export function AddQuestionMenu({ formPageId }: AddQuestionMenuProps) {
	const store = useBuilderStore()

	const getLabel = () => {
		const index = store.getSnapshot().context.fields.length

		return `field ${index + 1}`
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
							store.send({
								type: 'addField',
								field: {
									type: item.type,
									label: getLabel(),
									id: newId('field'),
									formPageId,
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
