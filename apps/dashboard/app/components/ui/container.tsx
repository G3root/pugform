import { cva } from 'class-variance-authority'
import type * as React from 'react'
import { cn } from '~/utils/classes'

const containerStyles = cva('mx-auto w-full max-w-7xl', {
	variants: {
		intent: {
			constrained: 'container sm:px-6 lg:px-8',
			'padded-content': 'px-4 sm:px-6 lg:px-8',
		},
	},
	defaultVariants: {
		intent: 'padded-content',
	},
})

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
	intent?: 'constrained' | 'padded-content'
}

const Container = ({ className, intent, ...props }: ContainerProps) => {
	return (
		<div className={cn(containerStyles({ intent, className }))} {...props} />
	)
}

export { Container }
