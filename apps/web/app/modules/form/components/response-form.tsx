import { getFormProps } from '@conform-to/react'
import { Form } from 'react-router';
import type { ComponentProps, ReactNode } from 'react'
import { useResponseForm } from '../hooks/use-response-form'

interface ResponseFormProps extends ComponentProps<typeof Form> {
	children: ReactNode
}

export function ResponseForm({ children, ...rest }: ResponseFormProps) {
	const form = useResponseForm()[0]
	return (
		<Form method="POST" {...getFormProps(form)} {...rest}>
			{children}
		</Form>
	)
}
