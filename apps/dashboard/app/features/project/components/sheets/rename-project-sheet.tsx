import { useLoaderData, useRouteLoaderData } from 'react-router'

import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '~/components/ui/sheet'
import { useQueryState } from '~/hooks/use-query-state'
import type { Info as LayoutRouteInfo } from '../../../../../../dashboard/.react-router/types/app/routes/(dashboard)/+types/_layout'
import { RenameProjectForm } from '../forms/rename-project-form'

export function RenameProjectSheet() {
	const loaderId: LayoutRouteInfo['id'] = 'routes/(dashboard)/_layout'
	const loader = useRouteLoaderData<LayoutRouteInfo['loaderData']>(loaderId)

	const [open, setOpen] = useQueryState('rename-project')
	const projectId = useQueryState('pid')[0]

	const projectName =
		loader && loader.type === 'success'
			? loader.data.find((p) => p.publicId === projectId)?.name
			: null

	if (!projectId || projectId.length < 3 || !projectName) {
		return null
	}

	const isOpen = Boolean(open) && Boolean(projectId)

	const handleOpenChange = (open: boolean) => {
		setOpen()
	}

	return (
		<Sheet open={isOpen} onOpenChange={handleOpenChange}>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Rename Project</SheetTitle>
					<SheetDescription>Change the name of your project</SheetDescription>
				</SheetHeader>
				<div className="p-4">
					<RenameProjectForm
						projectPublicId={projectId}
						projectName={projectName}
					/>
				</div>
			</SheetContent>
		</Sheet>
	)
}
