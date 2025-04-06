import { ScrollArea } from '~/components/ui/scroll-area'
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from '~/components/ui/sheet'
import { useQueryState } from '~/hooks/use-query-state'
import { CreateProjectForm } from '../forms/create-project-form'
export function CreateProjectSheet() {
	const [open, setOpen] = useQueryState('create-project')

	const isOpen = Boolean(open)

	const handleOpenChange = (open: boolean) => {
		setOpen()
	}

	return (
		<Sheet open={isOpen} onOpenChange={handleOpenChange}>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Create Project</SheetTitle>
					<SheetDescription>
						Create a new project to get started
					</SheetDescription>
				</SheetHeader>
				<div className="p-4">
					<CreateProjectForm />
				</div>
			</SheetContent>
		</Sheet>
	)
}
