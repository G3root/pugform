import { useLoaderData } from '@remix-run/react'
import { Card } from '~/components/ui/card'
import type { TWorkspaceIdLoader } from '~/routes/(application)/(dashboard)/workspace/[workspaceId]'

export function FormsList() {
	const {
		data: { workspace },
	} = useLoaderData<TWorkspaceIdLoader>()
	return <div>hello world</div>
}
