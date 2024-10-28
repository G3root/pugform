import { Button } from '~/components/ui/button'

export function BuilderHeader() {
	return (
		<div className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
			<div>
				<h1>Unknown Route</h1>
			</div>

			<div>
				<h1>Unknown Route</h1>
			</div>

			<div>
				<Button>Publish</Button>
			</div>
		</div>
	)
}
