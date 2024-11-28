import { clsx } from 'clsx/lite'
import type { ComponentProps } from 'preact'

export function CardFormInput({ className, ...rest }: ComponentProps<'input'>) {
	return (
		<input
			{...rest}
			className={clsx(
				'pf-card-input',
				'pf-text-2xl',
				'pf-outline-none pf-pb-2',
				'pf-border-b pf-border-primary/70',
				'focus-within:pf-border-b-2 focus-within:pf-border-primary',
				className,
			)}
		/>
	)
}
