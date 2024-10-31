import { forwardRef } from 'react'
import { type VariantProps, tv } from 'tailwind-variants'

const stackStyles = tv({
	base: 'flex',
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
		},
		fullWidth: {
			true: 'w-full',
		},
	},

	defaultVariants: {
		direction: 'column',
	},
})

const ClassName = 'justify'

const calculateGap = (val: number) => `${val * 0.25}rem`

export const Stack = forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement> &
		VariantProps<typeof stackStyles> & { gap?: number }
>(
	(
		{ className, direction, align, justify, fullWidth, gap = 4, ...props },
		ref,
	) => (
		<div
			ref={ref}
			style={{ gap: calculateGap(gap) }}
			className={stackStyles({
				direction,
				align,
				justify,
				fullWidth,
				className,
			})}
			{...props}
		/>
	),
)
Stack.displayName = 'Stack'
