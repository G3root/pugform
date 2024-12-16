import { clsx } from 'clsx/lite'

import { type ComponentProps, splitProps } from 'solid-js'

interface LabelProps extends Omit<ComponentProps<'label'>, 'children' | 'for'> {
	label: string
	id: string
}

export const labelStyles = clsx(
	'pf-label',
	'pf-cursor-default pf-font-medium pf-text-sm',
)

export function Label(props: LabelProps) {
	const [local, others] = splitProps(props, ['id', 'label'])
	return (
		<label {...others} for={local.id} class={clsx(labelStyles)}>
			{local.label}
		</label>
	)
}
