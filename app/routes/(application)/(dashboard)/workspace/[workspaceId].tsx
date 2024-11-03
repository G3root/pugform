import { parseWithZod } from '@conform-to/zod'
import type { ActionFunctionArgs, AppLoadContext } from '@remix-run/node'
import { type LoaderFunctionArgs, data } from '@remix-run/node'
import { Link, useLoaderData, useParams } from '@remix-run/react'
import { IconPlus } from 'justd-icons'
import { buttonStyles } from '~/components/ui/button'
import { Container } from '~/components/ui/container'
import { Heading } from '~/components/ui/heading'
import { Separator } from '~/components/ui/separator'
import { Stack } from '~/components/ui/stack'
import { DeleteFormSchema, RenameFormSchema } from '~/modules/form/schema'
import { FormsList } from '~/modules/workspace/components/forms-list'
import { trpcServer } from '~/trpc/server'
import { requireAuth } from '~/utils/auth.server'
import { createToastHeaders } from '~/utils/toast.server'

export const deleteFormActionIntent = 'delete-form'
export const renameFormActionIntent = 'rename-form'

export async function action({ request, context }: ActionFunctionArgs) {
	requireAuth(context)

	const formData = await request.formData()

	const intent = formData.get('intent')

	switch (intent) {
		case deleteFormActionIntent:
			return deleteFormAction({ context, formData, request })
		case renameFormActionIntent:
			return renameFormAction({ context, formData, request })

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

async function deleteFormAction({ formData, context, request }: TActionArgs) {
	const submission = parseWithZod(formData, {
		schema: DeleteFormSchema,
	})

	if (submission.status !== 'success') {
		return data(
			{ result: submission.reply(), status: 'failed' as const },
			{
				status: submission.status === 'error' ? 400 : 200,
				headers: await createToastHeaders({
					type: 'error',
					description: 'failed to delete form!',
				}),
			},
		)
	}

	const { message } = await trpcServer({
		context,
		request,
	}).form.delete(submission.value)

	return data(
		{
			result: submission.reply(),
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

async function renameFormAction({ formData, context, request }: TActionArgs) {
	const submission = parseWithZod(formData, {
		schema: RenameFormSchema,
	})

	if (submission.status !== 'success') {
		return data(
			{ result: submission.reply(), status: 'failed' as const },
			{
				status: submission.status === 'error' ? 400 : 200,
				headers: await createToastHeaders({
					type: 'error',
					description: 'failed to rename form!',
				}),
			},
		)
	}

	const { message } = await trpcServer({
		context,
		request,
	}).form.rename(submission.value)

	return data(
		{
			result: submission.reply(),
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

	const params = useParams()
	return (
		<Container>
			<Stack>
				<Stack direction="row" align="center" justify="between">
					<Heading>{workspace.name}</Heading>

					<Link
						className={buttonStyles()}
						to={`/dashboard/workspaces/${params.workspaceId}/form`}
					>
						<IconPlus /> New form
					</Link>
				</Stack>

				<Separator />

				<FormsList />
			</Stack>
		</Container>
	)
}
