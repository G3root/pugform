import { Button } from '~/components/ui/button'
import { FloatingButton } from '~/components/ui/floating-button'

import {
	AlignLeft,
	CheckSquare,
	CircleDot,
	Hash,
	List,
	type LucideIcon,
	Mail,
	Type,
} from 'lucide-react'

import {
	DialogContent,
	DialogHeader,
	DialogOverlay,
	DialogTitle,
	DialogTrigger,
} from '~/components/ui/dialog'
import { FIELD_LIST } from '../constants'

const IconMap: Partial<Record<FieldTypes, LucideIcon>> = {
	MULTIPLE_CHOICE: CircleDot,
	CHECKBOX: CheckSquare,
	DROPDOWN: List,
	LONG_ANSWER: AlignLeft,
	EMAIL: Mail,
	NUMBER: Hash,
	SHORT_ANSWER: Type,
}

export function FormElementsDrawer() {
	return (
		<DialogTrigger>
			<FloatingButton aria-label="add items" />
			<DialogOverlay>
				<DialogContent side="right" className="sm:max-w-[425px]">
					{() => (
						<>
							<DialogHeader>
								<DialogTitle>Form Elements</DialogTitle>
							</DialogHeader>
							<div className="grid gap-4 py-4">
								{FIELD_LIST.map((item) => {
									const ItemIcon = IconMap[item.type] as LucideIcon
									return (
										<Button
											className="justify-start"
											variant="outline"
											type="button"
											key={item.label}
										>
											<ItemIcon className="w-4 h-4" /> {item.label}
										</Button>
									)
								})}
							</div>
						</>
					)}
				</DialogContent>
			</DialogOverlay>
		</DialogTrigger>
	)
}
