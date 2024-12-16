import { clsx } from 'clsx/lite'
import type { ComponentProps } from 'solid-js'

export const fieldContainerStyles = clsx(
	'pf-field-container',
	'pf-flex pf-flex-col pf-gap-2',
)

export function FieldContainer(props: ComponentProps<'div'>) {
	return <div {...props} class={fieldContainerStyles} />
}
