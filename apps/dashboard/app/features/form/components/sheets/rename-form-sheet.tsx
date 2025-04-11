import { useParams, useRouteLoaderData } from 'react-router'

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
	const params = useParams<{ formId?: string }>()
	const [open, setOpen] = useQueryState('rename-form')
	const formIdQuery = useQueryState('fid')[0]

	const formId = params?.formId ?? formIdQuery

	const forms =
		loader && loader.type === 'success'
			? loader.data.flatMap((p) => p.forms)
			: null

	const formName = forms ? forms.find((f) => f.publicId === formId)?.name : null

	if (!formId || formId.length < 3 || !formName) {
		return null
	}

	const isOpen = Boolean(open) && Boolean(formId)

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
