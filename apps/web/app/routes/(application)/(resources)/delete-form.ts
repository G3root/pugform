import { parseWithZod } from '@conform-to/zod'
import type { ActionFunctionArgs } from 'react-router'
import { data } from 'react-router'
import { safeRedirect } from 'remix-utils/safe-redirect'
import { DeleteFormSchema } from '~/modules/form/schema'
import { trpcServer } from '~/trpc/server'
import { requireAuth } from '~/utils/auth.server'
import { createToastHeaders, redirectWithToast } from '~/utils/toast.server'

export async function action({ request, context, params }: ActionFunctionArgs) {
	requireAuth(context)

	const formData = await request.formData()

	const redirectTo = formData.get('redirectTo')

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

	return redirectTo
		? redirectWithToast(safeRedirect(redirectTo, '/dashboard'), {
				type: 'success',
				description: message,
			})
		: data(
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
