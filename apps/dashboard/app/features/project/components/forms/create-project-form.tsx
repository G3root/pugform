import { mergeForm, useTransform } from '@tanstack/react-form'
import { useActionData, useFetcher } from 'react-router'
import { useAppForm } from '~/hooks/form'
import type { action } from '../../../../routes/(resource)/create-project'
import { CreateProjectFormOptions, CreateProjectSchema } from '../../validation'

export function CreateProjectForm() {
	const actionData = useActionData<typeof action>()
	const form = useAppForm({
		...CreateProjectFormOptions,
		validators: {
			onChange: CreateProjectSchema,
		},
		transform: useTransform(
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			(baseForm) => mergeForm(baseForm, (actionData as any) ?? {}),
			[actionData],
		),
	})

	const fetcher = useFetcher({ key: 'create-project' })

	return (
		<fetcher.Form
			method="POST"
			action="/resource/create-project"
			onSubmit={() => form.handleSubmit()}
		>
			<form.AppField
				name="name"
				// biome-ignore lint/correctness/noChildrenProp: <explanation>
				children={(field) => <field.TextField label="Name" />}
			/>

			<div className="fixed right-2 bottom-8 w-full sm:max-w-[370px]">
				<form.AppForm>
					<form.SubscribeButton className="w-full" label="Save" />
				</form.AppForm>
			</div>
		</fetcher.Form>
	)
}
