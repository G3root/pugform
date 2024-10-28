import { createStore } from '@xstate/store'
import type { ReactNode } from 'react'
import { createContext } from '~/utils/create-context'

const [Provider, useBuilderStore] = createContext<
	ReturnType<typeof useCreateStore>
>({
	name: 'FormStateContext',
	hookName: 'useBuilderStore',
	providerName: '<BuilderStoreProvider />',
})

function useCreateStore() {
	return createStore({
		context: {
			data: {},
		},
		on: {},
	})
}

interface BuilderStoreProviderProviderProps {
	children: ReactNode
}

function BuilderStoreProvider({ children }: BuilderStoreProviderProviderProps) {
	const store = useCreateStore()
	return <Provider value={store}>{children}</Provider>
}

export { useBuilderStore, BuilderStoreProvider }
