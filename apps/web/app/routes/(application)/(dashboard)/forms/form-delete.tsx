import { parseWithZod } from '@conform-to/zod'
import { data } from 'react-router'
import { deleteFormActionIntent } from '~/modules/form/components/form-delete-dialog'
import { renameFormActionIntent } from '~/modules/form/components/form-rename-dialog'
import { DeleteFormSchema, RenameFormSchema } from '~/modules/form/schema'
import { trpcServer } from '~/trpc/server'
import { requireAuth } from '~/utils/auth.server'
import { createToastHeaders } from '~/utils/toast.server'
import type { Route } from './+types/_layout'

export async function loader({ context }: Route.LoaderArgs) {
	requireAuth(context)

	return {}
}

export async function action({ request, context, params }: Route.ActionArgs) {
	requireAuth(context)

	const formData = await request.formData()

	const intent = formData.get('intent')

	switch (intent) {
		case deleteFormActionIntent:
			return deleteFormAction({ context, formData, request, params })
		case renameFormActionIntent:
			return renameFormAction({ context, formData, request, params })

		default: {
			throw new Response(`Invalid intent "${intent}"`, { status: 400 })
		}
	}
}

type TActionArgs = {
	formData: FormData
} & Route.ActionArgs

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

export default function FormDelete() {
	return null
}
