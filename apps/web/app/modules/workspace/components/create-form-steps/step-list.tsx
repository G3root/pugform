import { useSelector } from '@xstate/store/react'
import { useCreateFormStepStore } from './create-form-step-provider'
import { HomeStep } from './home-step'
import { ScratchFormStep } from './scratch-form-step'

export function StepList() {
	const store = useCreateFormStepStore()
	const path = useSelector(store, (state) => state.context.currentPath)
	switch (path) {
		case 'home':
			return <HomeStep />

		case 'scratch':
			return <ScratchFormStep />

		default:
			return null
	}
}
