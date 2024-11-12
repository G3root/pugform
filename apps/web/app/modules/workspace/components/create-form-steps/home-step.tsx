import { IconPlus } from 'justd-icons'
import { ButtonPrimitive } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { Stack } from '~/components/ui/stack'
import { useCreateFormStepStore } from './create-form-step-provider'

export function HomeStep() {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
			<ScratchButton />
		</div>
	)
}

function ScratchButton() {
	const store = useCreateFormStepStore()
	return (
		<ButtonPrimitive
			onPress={() => {
				store.send({ type: 'setCurrentPath', newPath: 'scratch' })
			}}
		>
			<Card>
				<Card.Content className="py-4">
					<Stack className="min-h-60" align="center" justify="center" fullWidth>
						<IconPlus className="w-8 h-8" />
						<Card.Title>Start From Scratch</Card.Title>
					</Stack>
				</Card.Content>
			</Card>
		</ButtonPrimitive>
	)
}
