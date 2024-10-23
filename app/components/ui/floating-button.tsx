import { PlusIcon } from '@radix-ui/react-icons'
import { forwardRef } from 'react'
import { cn } from '~/lib/utils'
import { Button, type ButtonProps } from './button'

export const FloatingButton = forwardRef<
	HTMLButtonElement,
	Omit<ButtonProps, 'children'> & { 'aria-label': string }
>(({ className, ...props }, ref) => {
	return (
		<Button
			variant="default"
			size="icon"
			className={cn(
				'fixed bottom-4 left-4 rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105',
				className,
			)}
			ref={ref}
			{...props}
		>
			<PlusIcon className="h-6 w-6" />
		</Button>
	)
})
