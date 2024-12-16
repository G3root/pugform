import { clsx } from 'clsx/lite'
import type { ComponentProps } from 'solid-js'

export function ClassicFormInput(props: ComponentProps<'input'>) {
	return (
		<input
			{...props}
			class={clsx(
				'pf-classic-input',
				'pf-flex pf-h-9 pf-w-full pf-rounded-md pf-border pf-border-input',
				'pf-bg-transparent pf-outline-none focus:pf-outline-none pf-px-2.5 pf-py-2',
				'pf-transition pf-duration-200 pf-ease-out',
				'pf-placeholder-muted-fg',
				'focus-within:pf-border-primary/70 focus-within:pf-ring-primary/20 focus-within:pf-ring-4',
				'pf-text-base lg:pf-text-sm',
				'disabled:pf-cursor-not-allowed disabled:pf-opacity-50',
			)}
		/>
	)
}
