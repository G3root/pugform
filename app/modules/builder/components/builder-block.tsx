import { IconSettings, IconTrash } from 'justd-icons'
import { useId } from 'react'
import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { Menu } from '~/components/ui/menu'
import type { Field } from '~/lib/db.server'
import { useBuilderStore } from '../providers/builder-store-provider'

interface BuilderBlockProps extends Pick<Field, 'type' | 'label' | 'id'> {
	index: number
}

export function BuilderBlock({ type, label, id, index }: BuilderBlockProps) {
	const store = useBuilderStore()
	const labelId = useId()
	return (
		<Card>
			<Card.Header>
				<div className="flex items-center justify-between">
					<div>
						<label className="sr-only" htmlFor={labelId}>
							label
						</label>
						<input id={labelId} type="text" defaultValue={label} />
					</div>

					<div>
						<Menu>
							<Button
								aria-label="Menu"
								size="square-petite"
								appearance="outline"
							>
								<IconSettings />
							</Button>

							<Menu.Content>
								<Menu.Separator />
								<Menu.Item
									onAction={() => {
										store.send({ type: 'removeField', index })
									}}
									isDanger
								>
									<IconTrash /> Delete
								</Menu.Item>
							</Menu.Content>
						</Menu>
					</div>
				</div>
			</Card.Header>
		</Card>
	)
}
