import { forwardRef } from 'react'
import { type VariantProps, tv } from 'tailwind-variants'

const stackStyles = tv({
	base: 'flex',
	variants: {
		direction: {
			column: 'flex-col',
			row: 'flex-row',
		},
	},

	defaultVariants: {
		direction: 'column',
	},
})

const calculateGap = (val: number) => `${val * 0.25}rem`

export const Stack = forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement> &
		VariantProps<typeof stackStyles> & { gap?: number }
>(({ className, direction, gap = 4, ...props }, ref) => (
	<div
		ref={ref}
		style={{ gap: calculateGap(gap) }}
		className={stackStyles({ direction, className })}
		{...props}
	/>
))
Stack.displayName = 'Stack'
