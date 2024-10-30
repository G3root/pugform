import { FormProvider, getFormProps } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import type { ActionFunctionArgs } from '@remix-run/node'
import type { LoaderFunctionArgs } from '@remix-run/node'
import { Form, data } from '@remix-run/react'
import { BuilderFormList } from '~/modules/builder/components/builder-form-list'
import { BuilderHeader } from '~/modules/builder/components/builder-header'
import { useBuilderForm } from '~/modules/builder/hooks/use-builder-form'
import { BuilderStoreProvider } from '~/modules/builder/providers/builder-store-provider'
import { CreateFormSchema } from '~/modules/builder/schema'
import { requireAuth } from '~/utils/auth.server'

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData()

	const submission = parseWithZod(formData, {
		schema: CreateFormSchema,
	})

	if (submission.status !== 'success') {
		return data(
			{ result: submission.reply() },
			{ status: submission.status === 'error' ? 400 : 200 },
		)
	}

	const value = submission.value

	return data({ result: submission.reply() }, { status: 200 })
}

export async function loader({ request, context }: LoaderFunctionArgs) {
	requireAuth(context)
	return {}
}

export type TBuilderPageAction = typeof action

export default function Create() {
	const [form, _field, formId] = useBuilderForm()
	return (
		<FormProvider context={form.context}>
			<BuilderStoreProvider>
				<BuilderHeader formId={formId} />

				<div className="container h-full py-6 w-full flex flex-col items-center gap-4 justify-center">
					<Form
						method="POST"
						{...getFormProps(form)}
						className="flex flex-col items-center gap-4 justify-center"
					>
						<BuilderFormList formId={formId} />
					</Form>
				</div>
			</BuilderStoreProvider>
		</FormProvider>
	)
}
