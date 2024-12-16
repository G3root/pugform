import { type ParentComponent, useContext } from 'solid-js'
import { useFormData } from './form-data-provider'
import { FormStateContext, useCreateFormStateStore } from './form-state-context'

// biome-ignore lint/complexity/noBannedTypes: <explanation>
export const FormStateContextProvider: ParentComponent<{}> = (props) => {
	const formData = useFormData()
	const store = useCreateFormStateStore({
		totalPage: formData.totalPages,
	})

	return (
		<FormStateContext.Provider value={store}>
			{props.children}
		</FormStateContext.Provider>
	)
}

export const useFormState = () => {
	const data = useContext(FormStateContext)

	if (!data) {
		throw new Error('use useFormState inside <FormStateContext.Provider />')
	}

	return data
}
