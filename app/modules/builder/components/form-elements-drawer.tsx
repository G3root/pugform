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
	Mail,
	Type,
} from 'lucide-react'

const questionTypes = [
	{ type: 'text', icon: <Type className="w-4 h-4" />, label: 'Text' },
	{ type: 'number', icon: <Hash className="w-4 h-4" />, label: 'Number' },
	{ type: 'email', icon: <Mail className="w-4 h-4" />, label: 'Email' },
	{
		type: 'textarea',
		icon: <AlignLeft className="w-4 h-4" />,
		label: 'Long Text',
	},
	{ type: 'select', icon: <List className="w-4 h-4" />, label: 'Dropdown' },
	{
		type: 'checkbox',
		icon: <CheckSquare className="w-4 h-4" />,
		label: 'Checkbox',
	},
	{ type: 'radio', icon: <CircleDot className="w-4 h-4" />, label: 'Radio' },
]

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
					{questionTypes.map((item) => (
						<Button
							className="justify-start"
							variant="outline"
							type="button"
							key={item.label}
						>
							{item.icon} {item.label}
						</Button>
					))}
				</div>
			</SheetContent>
		</Sheet>
	)
}
