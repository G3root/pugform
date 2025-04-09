import { createFormHook } from '@tanstack/react-form'
import { lazy } from 'react'
import { Button } from '~/components/ui/button'
import { fieldContext, formContext, useFormContext } from './form-context'

const TextField = lazy(() =>
	import('~/components/ui/text-field').then((mod) => ({
		default: mod.TextField,
	})),
)

const TextareaField = lazy(() =>
	import('~/components/ui/textarea-field').then((mod) => ({
		default: mod.TextareaField,
	})),
)

interface SubscribeButtonProps extends React.ComponentProps<typeof Button> {
	label: string
}

function SubscribeButton({ label, ...props }: SubscribeButtonProps) {
	const form = useFormContext()
	return (
		<form.Subscribe selector={(state) => state.isSubmitting}>
			{(isSubmitting) => (
				<Button {...props} disabled={isSubmitting}>
					{label}
				</Button>
			)}
		</form.Subscribe>
	)
}

export const { useAppForm, withForm } = createFormHook({
	fieldComponents: {
		TextField,
		TextareaField,
	},
	formComponents: {
		SubscribeButton,
	},
	fieldContext,
	formContext,
})
