import { type VariantProps, cva } from 'class-variance-authority'
import { cn } from '~/utils/classes'

const stackStyles = cva('flex gap-[calc(var(--gap)*0.25rem)]', {
	variants: {
		direction: {
			column: 'flex-col',
			row: 'flex-row',
		},
		align: {
			center: 'items-center',
			start: 'items-start',
			end: 'items-end',
		},
		justify: {
			center: 'justify-center',
			between: 'justify-between',
			end: 'justify-end',
		},
		fullWidth: {
			true: 'w-full',
		},
	},

	defaultVariants: {
		direction: 'column',
	},
})

export const Stack = ({
	direction,
	align,
	justify,
	fullWidth,
	className,
	gap,
	...props
}: React.HTMLAttributes<HTMLDivElement> &
	VariantProps<typeof stackStyles> & { gap?: number }) => {
	return (
		<div
			className={cn(
				stackStyles({ direction, align, justify, fullWidth, className }),
			)}
			{...(gap ? { style: { '--gap': gap } as React.CSSProperties } : {})}
			{...props}
		/>
	)
}
