import { Link } from '@remix-run/react'
import { Button, buttonStyles } from '~/components/ui/button'
import type { useBuilderForm } from '../hooks/use-builder-form'

interface BuilderHeaderProps {
	formId: ReturnType<typeof useBuilderForm>[2]
}

export function BuilderHeader({ formId }: BuilderHeaderProps) {
	return (
		<div className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
			<div>
				<Link to="/dashboard" className={buttonStyles()}>
					Back to dashboard
				</Link>
			</div>

			<div>
				<h1>Unknown Route</h1>
			</div>

			<div>
				<Button form={formId} type="submit">
					Publish
				</Button>
			</div>
		</div>
	)
}
