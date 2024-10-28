import { createStoreWithProducer } from '@xstate/store'
import { create } from 'mutative'
import type { ReactNode } from 'react'
import type { NewField } from '~/lib/db.server'
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
			fields: [] as NewField[],
		},
		on: {
			addField: (context, event: { field: NewField }) => {
				context.fields.push(event.field)
			},

			removeField: (context, event: { index: number }) => {
				context.fields.splice(event.index, 1)
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
