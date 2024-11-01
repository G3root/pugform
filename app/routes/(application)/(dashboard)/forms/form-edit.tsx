import { FormProvider, getFormProps } from '@conform-to/react'
import type { ActionFunctionArgs } from '@remix-run/node'
import type { LoaderFunctionArgs } from '@remix-run/node'
import { Form } from '@remix-run/react'
import { BuilderFormList } from '~/modules/builder/components/builder-form-list'
import { BuilderHeader } from '~/modules/builder/components/builder-header'
import { useBuilderForm } from '~/modules/builder/hooks/use-builder-form'
import { BuilderStoreProvider } from '~/modules/builder/providers/builder-store-provider'
import { trpcServer } from '~/trpc/server'
import { requireAuth } from '~/utils/auth.server'

export async function action({ request, context }: ActionFunctionArgs) {
	requireAuth(context)
	return {}
}

export async function loader({ request, context, params }: LoaderFunctionArgs) {
	requireAuth(context)

	const formId = params.formId as string

	const {} = await trpcServer({ context, request }).form.get({ formId })
	return {}
}

export type TBuilderPageAction = typeof action

export default function FormEditPage() {
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
