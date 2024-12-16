import { clsx } from 'clsx/lite'
import type { ComponentProps } from 'solid-js'

export function Button(props: ComponentProps<'button'>) {
	return (
		<button
			{...props}
			class={clsx(
				'pf-button',
				'pf-inline-flex pf-items-center pf-justify-center pf-gap-2',
				'pf-font-medium pf-rounded-lg',
				'pf-text-primary-fg pf-bg-primary hover:pf-bg-primary/90',
				'pf-text-base lg:pf-text-sm/6',
				'pf-h-9 pf-px-4 pf-py-2',
			)}
		/>
	)
}
