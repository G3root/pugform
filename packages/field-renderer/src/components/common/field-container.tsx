import { clsx } from 'clsx/lite'
import type { ComponentProps } from 'preact'

export const fieldContainerStyles = clsx(
	'pf-field-container',
	'pf-flex pf-flex-col pf-gap-2',
)

export function FieldContainer(props: ComponentProps<'div'>) {
	return (
		<div {...props} className={clsx(fieldContainerStyles, props.className)} />
	)
}
