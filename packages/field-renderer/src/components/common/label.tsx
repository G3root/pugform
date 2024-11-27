import { clsx } from 'clsx/lite'
import type { ComponentProps } from 'preact'

interface LabelProps
	extends Omit<ComponentProps<'label'>, 'children' | 'htmlFor'> {
	label: string
	id: string
}

export function Label({ id, label, className, ...rest }: LabelProps) {
	return (
		<label
			htmlFor={id}
			className={clsx(
				'pf-label',
				'pf-cursor-default pf-font-medium pf-text-sm',
				className,
			)}
		>
			{label}
		</label>
	)
}
