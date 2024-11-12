import { useLoaderData } from '@remix-run/react'
import { IconGrid4 } from 'justd-icons'
import { Breadcrumbs } from '~/components/ui/breadcrumbs'
import { Button } from '~/components/ui/button'
import { Stack } from '~/components/ui/stack'
import type { TFormEditPageLoader } from '~/routes/(application)/(dashboard)/forms/form-edit'
import type { useBuilderForm } from '../../form/hooks/use-builder-form'

interface BuilderHeaderProps {
	formId: ReturnType<typeof useBuilderForm>[2]
}

export function BuilderHeader({ formId }: BuilderHeaderProps) {
	const { data } = useLoaderData<TFormEditPageLoader>()
	return (
		<div className="grid bg-bg grid-cols-3 w-full items-center h-16 gap-2 border-b px-4">
			<div>
				<Breadcrumbs>
					<Breadcrumbs.Item href="/dashboard">
						<IconGrid4 />

						<span className="sr-only">Dashboard</span>
					</Breadcrumbs.Item>
					<Breadcrumbs.Item
						href={`/dashboard/workspaces/${data.workspace.publicId}`}
					>
						{data.workspace?.name}
					</Breadcrumbs.Item>
					<Breadcrumbs.Item href="#">{data.form.title}</Breadcrumbs.Item>
				</Breadcrumbs>
			</div>

			<Stack align="center">
				<h1>Unknown Route</h1>
			</Stack>

			<Stack align="end">
				<Button form={formId} type="submit">
					Publish
				</Button>
			</Stack>
		</div>
	)
}
