import {
	FormDataProvider,
	type TFormDataContext,
} from '~/providers/form-data-provider'

import { CardForm } from './card-form'
import { ClassicForm } from './classic-form'

export function FieldRenderer({ layout, ...rest }: TFormDataContext) {
	return (
		<FormDataProvider layout={layout} {...rest}>
			{layout === 'CARD' ? <CardForm /> : <ClassicForm />}
		</FormDataProvider>
	)
}
