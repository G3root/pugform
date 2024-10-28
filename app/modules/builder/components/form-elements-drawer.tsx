import { Button } from '~/components/ui/button'
import { FloatingButton } from '~/components/ui/floating-button'
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '~/components/ui/sheet'

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
		<Sheet>
			<SheetTrigger asChild>
				<FloatingButton aria-label="add items" />
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Form Elements</SheetTitle>
					<SheetDescription className="sr-only">Form Elements</SheetDescription>
				</SheetHeader>
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
			</SheetContent>
		</Sheet>
	)
}
