import {
	Match,
	type ParentComponent,
	Suspense,
	Switch,
	createResource,
	useContext,
} from 'solid-js'
import { FormDataContext, type TFormData } from './form-data-context'

type TFetchFormDataResp =
	| { status: 'failed'; errorMsg: string; data?: never }
	| { status: 'success'; data: TFormData; errorMsg?: never }

const fetchFormData = async (formId: string) => {
	const response = await fetch(
		`http://localhost:3000/api/resources/form/${formId}`,
	)
	return response.json() as unknown as TFetchFormDataResp
}

interface FormDataProviderProps {
	formId: string
}

export const FormDataProvider: ParentComponent<FormDataProviderProps> = (
	props,
) => {
	const [formData] = createResource(props.formId, fetchFormData)
	return (
		<Suspense>
			<Switch>
				<Match when={formData.error}>
					<span>Error: {formData.error.message}</span>
				</Match>

				<Match when={formData() && formData()?.status === 'success'}>
					<FormDataContext.Provider value={formData()?.data}>
						{props.children}
					</FormDataContext.Provider>
				</Match>
			</Switch>
		</Suspense>
	)
}

export const useFormData = () => {
	const data = useContext(FormDataContext)

	if (!data) {
		throw new Error('use useFormData inside <FormDataProvider />')
	}

	return data
}
