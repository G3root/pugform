import { createFormHook } from '@tanstack/react-form'
import { lazy } from 'react'
import { Button } from '~/components/ui/button'
import { fieldContext, formContext, useFormContext } from './form-context'

const TextField = lazy(() =>
	import('~/components/ui/text-field').then((mod) => ({
		default: mod.TextField,
	})),
)

function SubscribeButton({ label }: { label: string }) {
	const form = useFormContext()
	return (
		<form.Subscribe selector={(state) => state.isSubmitting}>
			{(isSubmitting) => <Button disabled={isSubmitting}>{label}</Button>}
		</form.Subscribe>
	)
}

export const { useAppForm, withForm } = createFormHook({
	fieldComponents: {
		TextField,
	},
	formComponents: {
		SubscribeButton,
	},
	fieldContext,
	formContext,
})
