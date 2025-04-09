import { useRouteLoaderData } from 'react-router'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '~/components/ui/dialog'
import { useQueryState } from '~/hooks/use-query-state'
import type { Info as LayoutRouteInfo } from '../../../../routes/(dashboard)/+types/_layout'
import { CreateFormForm } from '../forms/create-form-form'

export function CreateFormDialog() {
	const loaderId: LayoutRouteInfo['id'] = 'routes/(dashboard)/_layout'
	const loader = useRouteLoaderData<LayoutRouteInfo['loaderData']>(loaderId)

	const [open, setOpen] = useQueryState('create-form')
	const projectId = useQueryState('pid')[0]

	const existingProjectId =
		loader && loader.type === 'success'
			? loader.data.find((p) => p.publicId === projectId)?.id
			: null

	if (!projectId || projectId.length < 3 || !existingProjectId) {
		return null
	}

	const isOpen = Boolean(open) && Boolean(projectId)

	const handleOpenChange = (open: boolean) => {
		setOpen()
	}

	return (
		<Dialog open={isOpen} onOpenChange={handleOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create Form</DialogTitle>
					<DialogDescription>
						Create a new form to get started
					</DialogDescription>
				</DialogHeader>

				<CreateFormForm projectPublicId={projectId} />
			</DialogContent>
		</Dialog>
	)
}
