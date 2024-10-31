import { type LoaderFunctionArgs, data } from '@remix-run/node'
import { useActionData, useLoaderData } from '@remix-run/react'
import { IconPlus } from 'justd-icons'
import { Button } from '~/components/ui/button'
import { Container } from '~/components/ui/container'
import { Heading } from '~/components/ui/heading'
import { Separator } from '~/components/ui/separator'
import { Stack } from '~/components/ui/stack'
import { FormsList } from '~/modules/workspace/components/forms-list'
import { trpcServer } from '~/trpc/server'
import { requireAuth } from '~/utils/auth.server'

export async function loader({ request, context, params }: LoaderFunctionArgs) {
	requireAuth(context)

	const publicId = params.workspaceId as string

	const { workspace } = await trpcServer({
		request,
		context,
	}).workspace.getByPublicId({ publicId })
	return { data: { workspace } }
}

export type TWorkspaceIdLoader = typeof loader

export default function WorkspaceIdPage() {
	const {
		data: { workspace },
	} = useLoaderData<TWorkspaceIdLoader>()
	return (
		<Container>
			<Stack>
				<Stack direction="row" className="items-center justify-between">
					<Heading>{workspace.name}</Heading>

					<Button>
						<IconPlus /> New form
					</Button>
				</Stack>

				<Separator />

				<FormsList />
			</Stack>
		</Container>
	)
}

function Title() {}
