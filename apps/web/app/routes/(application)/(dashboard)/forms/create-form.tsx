import { parseWithZod } from '@conform-to/zod'
import {
	type ActionFunctionArgs,
	type AppLoadContext,
	type LoaderFunctionArgs,
	data,
	redirect,
} from 'react-router'
import { Container } from '~/components/ui/container'
import { Description } from '~/components/ui/field'
import { Heading } from '~/components/ui/heading'
import { Stack } from '~/components/ui/stack'
import { CreateScratchFormSchema } from '~/modules/form/schema'
import { CreateFormStepProvider } from '~/modules/workspace/components/create-form-steps/create-form-step-provider'
import { StepList } from '~/modules/workspace/components/create-form-steps/step-list'
import { trpcServer } from '~/trpc/server'
import { requireAuth } from '~/utils/auth.server'

export const scratchFormActionIntent = 'scratch-form'

export async function loader({ context }: LoaderFunctionArgs) {
	requireAuth(context)
	return {}
}

export async function action({ request, context }: ActionFunctionArgs) {
	requireAuth(context)

	const formData = await request.formData()

	const intent = formData.get('intent')

	switch (intent) {
		case scratchFormActionIntent:
			return createScratchFormAction({ context, formData, request })

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

async function createScratchFormAction({
	formData,
	context,
	request,
}: TActionArgs) {
	const submission = parseWithZod(formData, {
		schema: CreateScratchFormSchema,
	})

	if (submission.status !== 'success') {
		return data(
			{ result: submission.reply(), status: 'failed' as const },
			{ status: submission.status === 'error' ? 400 : 200 },
		)
	}

	const { form } = await trpcServer({
		context,
		request,
	}).form.createScratchForm(submission.value)

	return redirect(`/dashboard/forms/${form.id}/edit`)
}

export default function CreateFormPage() {
	return (
		<CreateFormStepProvider>
			<Container>
				<Stack gap={12}>
					<Stack direction="row" align="center" justify="center" fullWidth>
						<Stack align="center" gap={0}>
							<Heading>Create a Form</Heading>
							<Description className="text-center">
								Start collecting responses by creating or importing your form.
							</Description>
						</Stack>
					</Stack>

					<StepList />
				</Stack>
			</Container>
		</CreateFormStepProvider>
	)
}
