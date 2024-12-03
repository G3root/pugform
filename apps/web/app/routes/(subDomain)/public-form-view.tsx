import { formWidget } from '@pugform/field-renderer'
import { useEffect } from 'react'
import { trpcServer } from '~/trpc/server'
import type { Route } from './+types/public-form-view'
import '@pugform/field-renderer/style.css'

export async function loader({ request, context, params }: Route.LoaderArgs) {
	const formId = params.formId

	const { data } = await trpcServer({ request, context }).form.getPublic({
		formId,
	})
	return {
		data,
	}
}

export default function PublicFormView({ loaderData }: Route.ComponentProps) {
	useEffect(() => {
		const widget = formWidget()

		widget.render({
			selector: '[data-island="widget"]',
			initialProps: {
				...loaderData.data.form,
				...loaderData.data.meta,
				fields: loaderData.data.fields,
				pages: loaderData.data.pages,
			},
		})

		return () => {
			widget.destroy()
		}
	}, [])

	return (
		<div className="flex flex-col w-full min-h-screen h-full items-center justify-center">
			<div
				className="w-full h-full flex items-center justify-center"
				data-island="widget"
			/>
		</div>
	)
}
