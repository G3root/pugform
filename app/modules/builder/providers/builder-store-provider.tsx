import { createStoreWithProducer } from '@xstate/store'
import { create } from 'mutative'
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
	return createStoreWithProducer(create, {
		context: {
			fields: [] as Field[],
		},
		on: {
			addField: (context, event: { field: Field }) => {
				context.fields.push(event.field)
			},
		},
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
