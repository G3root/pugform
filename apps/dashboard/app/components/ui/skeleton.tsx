import type * as React from 'react'
import { cn } from '~/utils/classes'

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="skeleton"
			className={cn('animate-pulse rounded-md bg-accent', className)}
			{...props}
		/>
	)
}

export { Skeleton }
