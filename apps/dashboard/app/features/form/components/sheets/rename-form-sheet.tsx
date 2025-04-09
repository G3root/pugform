import { useRouteLoaderData } from 'react-router'

import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from '~/components/ui/sheet'
import { useQueryState } from '~/hooks/use-query-state'
import type { Info as LayoutRouteInfo } from '../../../../routes/(dashboard)/+types/_layout'

import { RenameFormForm } from '../forms/rename-form-form'

export function RenameFormSheet() {
	const loaderId: LayoutRouteInfo['id'] = 'routes/(dashboard)/_layout'
	const loader = useRouteLoaderData<LayoutRouteInfo['loaderData']>(loaderId)

	const [open, setOpen] = useQueryState('rename-form')
	const projectId = useQueryState('pid')[0]
	const formId = useQueryState('fid')[0]

	const project =
		loader && loader.type === 'success'
			? loader.data.find((p) => p.publicId === projectId)
			: null

	const formName = project
		? project.forms.find((f) => f.publicId === formId)?.name
		: null

	if (
		!projectId ||
		!formId ||
		projectId.length < 3 ||
		formId.length < 3 ||
		!formName
	) {
		return null
	}

	const isOpen = Boolean(open) && Boolean(projectId) && Boolean(formId)

	const handleOpenChange = (open: boolean) => {
		setOpen()
	}

	return (
		<Sheet open={isOpen} onOpenChange={handleOpenChange}>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Rename Form</SheetTitle>
					<SheetDescription>Change the name of your form</SheetDescription>
				</SheetHeader>
				<div className="p-4">
					<RenameFormForm formPublicId={formId} name={formName} />
				</div>
			</SheetContent>
		</Sheet>
	)
}
