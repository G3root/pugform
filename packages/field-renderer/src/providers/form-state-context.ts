import { createContext, createEffect, createMemo } from 'solid-js'
import { createStore } from 'solid-js/store'

export const FormStateContext =
	createContext<ReturnType<typeof useCreateFormStateStore>>()

interface TCreateFormStateStoreArgs {
	totalPage?: number
}

export function useCreateFormStateStore(props: TCreateFormStateStoreArgs) {
	const [state, setState] = createStore({
		currentPage: 0,
		totalPages: props.totalPage || 0,
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		data: [] as Record<string, any>[],
		isLastPage: false,
		isNotFirstPage: true,
		progressPercentage: 0,
		pageType: 'form' as 'form' | 'ending',
	})

	const derivedState = createMemo(() => ({
		progressPercentage:
			state.totalPages > 0 ? (state.currentPage / state.totalPages) * 100 : 0,
		pageType:
			state.currentPage === state.totalPages
				? ('ending' as const)
				: ('form' as const),
		isLastPage: state.currentPage === state.totalPages - 1,
		isNotFirstPage: state.currentPage > 0,
	}))

	createEffect(() => {
		const derived = derivedState()
		setState('progressPercentage', derived.progressPercentage)
		setState('pageType', derived.pageType)
		setState('isLastPage', derived.isLastPage)
		setState('isNotFirstPage', derived.isNotFirstPage)
	})

	return [state, setState] as const
}
