import { parseWithZod } from '@conform-to/zod'
import {
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
	data,
} from '@remix-run/node'
import { Heading } from '~/components/ui/heading'
import { CreateWorkspaceModal } from '~/modules/workspace/components/create-workspace-modal'
import { CreateWorkspaceSchema } from '~/modules/workspace/schema'
import { trpcServer } from '~/trpc/server'
import { requireAuth } from '~/utils/auth.server'
import { createToastHeaders } from '~/utils/toast.server'

export async function loader({ context }: LoaderFunctionArgs) {
	requireAuth(context)
	return {}
}

export async function action({ request, context }: ActionFunctionArgs) {
	requireAuth(context)

	const formData = await request.formData()

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
	}).workspace.createWorkspace(submission.value)

	return data(
		{ result: submission.reply(), status: 'success' as const },
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

export default function AllWorkspacesPage() {
	return (
		<div>
			<div className="flex items-center justify-between">
				<Heading>Workspaces</Heading>

				<CreateWorkspaceModal />
			</div>
		</div>
	)
}
