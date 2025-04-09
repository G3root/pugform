import { mergeForm, useTransform } from '@tanstack/react-form'
import { useFetcher } from 'react-router'
import { useAppForm } from '~/hooks/form'
import { RenameFormFormSchema } from '../../validation'

interface RenameFormFormProps {
	formPublicId: string
	name: string
}

export function RenameFormForm({ formPublicId, name }: RenameFormFormProps) {
	const fetcher = useFetcher({ key: 'rename-form' })
	const form = useAppForm({
		defaultValues: {
			name,
			formPublicId,
		},
		validators: {
			onChange: RenameFormFormSchema,
		},
		transform: useTransform(
			(baseForm) => mergeForm(baseForm, fetcher.data ?? {}),
			[fetcher.data],
		),
	})

	return (
		<fetcher.Form
			method="POST"
			action="/resource/rename-form"
			onSubmit={() => form.handleSubmit()}
		>
			<form.AppField
				name="name"
				// biome-ignore lint/correctness/noChildrenProp: <explanation>
				children={(field) => <field.TextField label="Name" />}
			/>
			<form.Field
				name="formPublicId"
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
