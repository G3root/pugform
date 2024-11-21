import { parseWithZod } from '@conform-to/zod'
import type { ActionFunctionArgs } from 'react-router'
import { data } from 'react-router'
import { RenameFormSchema } from '~/modules/form/schema'
import { trpcServer } from '~/trpc/server'
import { requireAuth } from '~/utils/auth.server'
import { createToastHeaders } from '~/utils/toast.server'

export async function action({ request, context, params }: ActionFunctionArgs) {
	requireAuth(context)

	const formData = await request.formData()

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
