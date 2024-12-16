import { Match, Switch } from 'solid-js'
import { FormDataProvider, useFormData } from '~/providers/form-data-provider'
import { FormStateContextProvider } from '~/providers/form-state-provider'
import { CardForm } from './card-form'

interface FieldRendererProps {
	formId: string
}

export function FieldRenderer(props: FieldRendererProps) {
	return (
		<FormDataProvider formId={props.formId}>
			<FormStateContextProvider>
				<Renderer />
			</FormStateContextProvider>
		</FormDataProvider>
	)
}

function Renderer() {
	const formData = useFormData()

	return (
		<Switch>
			<Match when={formData.layout === 'CARD'}>
				<CardForm />
			</Match>
		</Switch>
	)
}
