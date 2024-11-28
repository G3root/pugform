import { computed, signal } from '@preact/signals'
import { createContext } from 'preact'
import { useContext } from 'preact/hooks'

interface TCreateFormStateArgs {
	totalPage: number
}

export function createFormState(input: TCreateFormStateArgs) {
	const currentPage = signal(0)
	const totalPages = signal(input.totalPage)
	const data = signal<Record<string, string>[]>([])
	const progressPercentage = computed(
		() => (currentPage.value / totalPages.value) * 100,
	)

	const pageType = computed(() =>
		currentPage.value === totalPages.value ? 'ending' : 'form',
	)

	const isLastPage = computed(() => currentPage.value === totalPages.value - 1)

	const isNotFirstPage = computed(() => currentPage.value > 0)

	return {
		currentPage,
		totalPages,
		progressPercentage,
		isLastPage,
		isNotFirstPage,
		pageType,
		data,
	}
}

export const FormStateContext = createContext<ReturnType<
	typeof createFormState
> | null>(null)

export const useFormState = () => {
	const data = useContext(FormStateContext)

	if (!data) {
		throw new Error('use useFormState inside <FormStateContext.Provider />')
	}

	return data
}
