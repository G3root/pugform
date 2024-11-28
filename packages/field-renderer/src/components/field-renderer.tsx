import {
	FormDataProvider,
	type TFormDataContext,
} from '~/providers/form-data-provider'

import { useMemo } from 'preact/hooks'
import {
	FormStateContext,
	createFormState,
} from '~/providers/form-state-provider'
import { CardForm } from './card-form'
import { ClassicForm } from './classic-form'

export function FieldRenderer({ layout, ...rest }: TFormDataContext) {
	const formState = useMemo(
		() => createFormState({ totalPage: rest.totalPages }),
		[rest.totalPages],
	)

	return (
		<FormStateContext.Provider value={formState}>
			<FormDataProvider layout={layout} {...rest}>
				{layout === 'CARD' ? <CardForm /> : <ClassicForm />}
			</FormDataProvider>
		</FormStateContext.Provider>
	)
}
