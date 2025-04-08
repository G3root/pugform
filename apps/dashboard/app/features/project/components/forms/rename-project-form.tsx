import { mergeForm, useStore, useTransform } from '@tanstack/react-form'
import { Form, useActionData, useFetcher } from 'react-router'
import { useAppForm } from '~/hooks/form'
import { RenameProjectFormSchema } from '../../validation'

interface RenameProjectFormProps {
	projectPublicId: string
	projectName: string
}

export function RenameProjectForm({
	projectPublicId,
	projectName,
}: RenameProjectFormProps) {
	const fetcher = useFetcher({ key: 'rename-project' })
	const form = useAppForm({
		defaultValues: {
			name: projectName,
			projectPublicId,
		},
		validators: {
			onChange: RenameProjectFormSchema,
		},
		transform: useTransform(
			(baseForm) => mergeForm(baseForm, fetcher.data ?? {}),
			[fetcher.data],
		),
	})

	return (
		<fetcher.Form
			method="POST"
			action="/resource/rename-project"
			onSubmit={() => form.handleSubmit()}
		>
			<form.AppField
				name="name"
				// biome-ignore lint/correctness/noChildrenProp: <explanation>
				children={(field) => <field.TextField label="Name" />}
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

			<div className="fixed right-2 bottom-8 w-full sm:max-w-[370px]">
				<form.AppForm>
					<form.SubscribeButton className="w-full" label="Save" />
				</form.AppForm>
			</div>
		</fetcher.Form>
	)
}
