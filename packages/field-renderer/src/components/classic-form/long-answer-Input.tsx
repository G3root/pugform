import { clsx } from 'clsx/lite'
import type { ComponentProps } from 'solid-js'

export function ClassicFormLongAnswerInput(props: ComponentProps<'textarea'>) {
	return (
		<textarea
			{...props}
			class={clsx(
				'pf-classic-long-answer-input',
				'pf-outline-none focus:pf-outline-none',
				'focus-within:pf-border-primary/70 focus-within:pf-ring-primary/20 focus-within:pf-ring-4',
				'pf-border pf-border-input pf-bg-bg',
				'pf-w-full pf-min-w-0 pf-rounded-lg  pf-px-2.5 pf-py-2 pf-text-base',
				'pf-shadow-sm pf-transition pf-duration-200',
			)}
		/>
	)
}
