import { useEffect, useState } from 'react'
import type { Route } from './+types/public-form-view'
import '@pugform/field-renderer/style.css'

interface WidgetProps {
	formId: string
}

function Widget({ formId }: WidgetProps) {
	const [, setLoaded] = useState(false)
	const id = performance.now.toString()

	useEffect(() => {
		;(async () => {
			import('@pugform/field-renderer')
			setLoaded(true)
		})()
	}, [])

	//@ts-ignore
	return <pug-form form-id={formId} />
}

export default function PublicFormView({ params }: Route.ComponentProps) {
	return (
		<div className="flex flex-col w-full min-h-screen h-full items-center justify-center">
			<div className="w-full h-full flex items-center justify-center">
				<Widget formId={params.formId} />
			</div>
		</div>
	)
}
