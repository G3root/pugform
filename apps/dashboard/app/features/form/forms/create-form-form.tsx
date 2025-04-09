import { mergeForm, useTransform } from '@tanstack/react-form'
import { useActionData, useFetcher } from 'react-router'
import { DialogFooter } from '~/components/ui/dialog'
import { useAppForm } from '~/hooks/form'
import { CreateFormFormOptions, CreateFormFormSchema } from '../validation'

interface CreateFormFormProps {
	projectPublicId: string
}

export function CreateFormForm({ projectPublicId }: CreateFormFormProps) {
	const fetcher = useFetcher({ key: 'create-form' })

	const form = useAppForm({
		defaultValues: {
			projectPublicId,
			name: '',
			description: '',
		},
		validators: {
			onChange: CreateFormFormSchema,
		},
		transform: useTransform(
			(baseForm) => mergeForm(baseForm, fetcher.data ?? {}),
			[fetcher.data],
		),
	})

	return (
		<fetcher.Form
			method="POST"
			action="/resource/create-form"
			onSubmit={() => form.handleSubmit()}
			className="flex flex-col gap-4"
		>
			<form.AppField
				name="name"
				// biome-ignore lint/correctness/noChildrenProp: <explanation>
				children={(field) => <field.TextField label="Name" />}
			/>

			<form.AppField
				name="description"
				// biome-ignore lint/correctness/noChildrenProp: <explanation>
				children={(field) => <field.TextareaField label="Description" />}
			/>

			<form.Field
				name="projectPublicId"
				// biome-ignore lint/correctness/noChildrenProp: <explanation>
				children={(field) => (
					<input
						type="hidden"
						readOnly
						className="sr-only"
						value={field.state.value}
						name={field.name}
					/>
				)}
			/>

			<DialogFooter>
				<form.AppForm>
					<form.SubscribeButton className="w-full" label="Save" />
				</form.AppForm>
			</DialogFooter>
		</fetcher.Form>
	)
}
