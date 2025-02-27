import { FormProvider, getFormProps, getInputProps } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import type { ActionFunctionArgs } from 'react-router';
import type { LoaderFunctionArgs } from 'react-router';
import { Form, data, useLoaderData, useParams } from 'react-router';
import { Button, type ButtonProps } from '~/components/ui/button'
import { BuilderFormList } from '~/modules/builder/components/builder-form-list'
import { BuilderHeader } from '~/modules/builder/components/builder-header'
import { BuilderStoreProvider } from '~/modules/builder/providers/builder-store-provider'
import { useBuilderForm } from '~/modules/form/hooks/use-builder-form'
import { UpdateFormSchema } from '~/modules/form/schema'
import { trpcServer } from '~/trpc/server'
import { requireAuth } from '~/utils/auth.server'
import { newId } from '~/utils/uuid'

export async function action({ request, context }: ActionFunctionArgs) {
	requireAuth(context)

	const formData = await request.formData()

	const submission = parseWithZod(formData, {
		schema: UpdateFormSchema,
	})

	if (submission.status !== 'success') {
		return data(
			{ result: submission.reply() },
			{ status: submission.status === 'error' ? 400 : 200 },
		)
	}

	const value = submission.value

	await trpcServer({
		context,
		request,
	}).form.update(value)

	return data({ result: submission.reply() }, { status: 200 })
}

export async function loader({ request, context, params }: LoaderFunctionArgs) {
	requireAuth(context)

	const formId = params.formId as string

	const { data } = await trpcServer({ context, request }).form.get({ formId })
	return { data }
}

export type TFormEditPageAction = typeof action
export type TFormEditPageLoader = typeof loader

export default function FormEditPage() {
	const params = useParams()

	const { data } = useLoaderData<TFormEditPageLoader>()
	const [form, _field, formId] = useBuilderForm({
		form: { id: params.formId as string, status: data.form.status },
		pages: data.pages,
	})

	const formValues = form.getFieldset().form.getFieldset()

	const id = formValues.id
	const status = formValues.status

	const addPagesHandler = () => {
		const page = form.getFieldset().pages

		form.insert({
			name: page.name,
			defaultValue: {
				id: newId('page'),
				fields: [],
			},
		})
	}
	return (
		<div className="flex flex-col w-full min-h-screen bg-[hsl(var(--secondary)/80%)]">
			<FormProvider context={form.context}>
				<BuilderStoreProvider>
					<BuilderHeader formId={formId} />

					<div className="container h-full py-6 w-full flex flex-col items-center gap-4 justify-center">
						<Form
							method="POST"
							{...getFormProps(form)}
							className="flex flex-col items-center gap-4 justify-center w-full"
						>
							<input {...getInputProps(id, { type: 'hidden' })} key={id.key} />

							<input
								{...getInputProps(status, { type: 'hidden' })}
								key={status.key}
							/>

							<BuilderFormList formId={formId} />

							<AddNewPageButton onPress={addPagesHandler} />
						</Form>
					</div>
				</BuilderStoreProvider>
			</FormProvider>
		</div>
	)
}

interface AddNewPageButtonProps extends ButtonProps {}

function AddNewPageButton(props: AddNewPageButtonProps) {
	return <Button {...props}>add new page</Button>
}
