import { createStore, createStoreWithProducer } from '@xstate/store'
import { IconPlus } from 'justd-icons'
import { create } from 'mutative'
import { type ReactNode, useState } from 'react'
import { ButtonPrimitive } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { Stack } from '~/components/ui/stack'
import { createContext } from '~/utils/create-context'

const [Provider, useCreateFormStepStore] = createContext<
	ReturnType<typeof useCreateStore>
>({
	name: 'FormStateContext',
	hookName: 'useCreateFormStepStore',
	providerName: '<CreateFormStepProvider />',
})

type TOption = 'home' | 'scratch' | 'import'

function useCreateStore() {
	return createStore({
		context: {
			currentPath: 'home' as TOption,
		},
		on: {
			setCurrentPath: {
				currentPath: (context, event: { newPath: TOption }) => event.newPath,
			},
		},
	})
}

interface CreateFormStepProviderProps {
	children: ReactNode
}

function CreateFormStepProvider({ children }: CreateFormStepProviderProps) {
	const [state] = useState(() => useCreateStore())

	return <Provider value={state}>{children}</Provider>
}

export { CreateFormStepProvider, useCreateFormStepStore }
