import { parseWithZod } from '@conform-to/zod'
import {
	type ActionFunctionArgs,
	type AppLoadContext,
	type LoaderFunctionArgs,
	data,
} from '@remix-run/node'
import { Container } from '~/components/ui/container'
import { Heading } from '~/components/ui/heading'
import { Separator } from '~/components/ui/separator'
import { Stack } from '~/components/ui/stack'
import { CreateWorkspaceModal } from '~/modules/workspace/components/create-workspace-modal'
import { WorkspaceList } from '~/modules/workspace/components/workspace-list'
import {
	CreateWorkspaceSchema,
	DeleteWorkspaceSchema,
} from '~/modules/workspace/schema'
import { trpcServer } from '~/trpc/server'
import { requireAuth } from '~/utils/auth.server'
import { createToastHeaders } from '~/utils/toast.server'

export async function loader({ context, request }: LoaderFunctionArgs) {
	requireAuth(context)

	const { workspaces } = await trpcServer({
		context,
		request,
	}).workspace.all()

	return {
		data: {
			workspaces,
		},
	}
}

export const workspaceCreateActionIntent = 'workspace-create'
export const workspaceDeleteActionIntent = 'workspace-delete'

export async function action({ request, context }: ActionFunctionArgs) {
	requireAuth(context)

	const formData = await request.formData()

	const intent = formData.get('intent')

	switch (intent) {
		case workspaceCreateActionIntent:
			return workspaceCreateAction({ context, formData, request })

		case workspaceDeleteActionIntent:
			return workspaceDeleteAction({ context, formData, request })

		default: {
			throw new Response(`Invalid intent "${intent}"`, { status: 400 })
		}
	}
}

type TActionArgs = {
	request: Request
	formData: FormData
	context: AppLoadContext
}

async function workspaceCreateAction({
	formData,
	context,
	request,
}: TActionArgs) {
	const submission = parseWithZod(formData, {
		schema: CreateWorkspaceSchema,
	})

	if (submission.status !== 'success') {
		return data(
			{ result: submission.reply(), status: 'failed' as const },
			{ status: submission.status === 'error' ? 400 : 200 },
		)
	}

	const { message } = await trpcServer({
		context,
		request,
	}).workspace.create(submission.value)

	return data(
		{
			result: submission.reply(),
			status: 'success' as const,
		},
		{
			status: 200,
			headers: await createToastHeaders({
				type: 'success',
				description: message,
			}),
		},
	)
}

async function workspaceDeleteAction({
	formData,
	context,
	request,
}: TActionArgs) {
	const submission = parseWithZod(formData, {
		schema: DeleteWorkspaceSchema,
	})

	if (submission.status !== 'success') {
		return data(
			{ result: submission.reply(), status: 'failed' as const },
			{ status: submission.status === 'error' ? 400 : 200 },
		)
	}

	const { message } = await trpcServer({
		context,
		request,
	}).workspace.delete(submission.value)

	return data(
		{
			result: submission.reply(),
			status: 'success' as const,
		},
		{
			status: 200,
			headers: await createToastHeaders({
				type: 'success',
				description: message,
			}),
		},
	)
}

export type TCreateWorkspaceAction = typeof action
export type TAllWorkspaceLoader = typeof loader

export default function AllWorkspacesPage() {
	return (
		<Container>
			<Stack>
				<Stack direction="row" className="items-center justify-between">
					<Heading>Workspaces</Heading>

					<CreateWorkspaceModal />
				</Stack>

				<Separator />

				<WorkspaceList />
			</Stack>
		</Container>
	)
}
