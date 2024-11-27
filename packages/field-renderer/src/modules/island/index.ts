import { type ComponentType, render } from 'preact'
import {
	type InitialProps,
	type Island,
	getCurrentScript,
	getHostElements,
	mount,
	renderIsland,
} from './utils'

export const createIsland = <P extends InitialProps>(
	widget: ComponentType<P>,
) => {
	const island: Island<P> = {
		_roots: [],
		_executedScript: getCurrentScript(),
		props: {} as P,
		render: ({
			selector,
			cleanRoot = false,
			replace = false,
			inline = false,
			initialProps = {},
			propsSelector,
		}) => {
			let rendered = false

			const load = () => {
				if (rendered === true) return

				const hostElements = getHostElements({
					selector,
					inline,
				})

				// Do nothing if no host elements returned
				if (hostElements.length === 0) return
				const { rootFragments } = mount<P>({
					hostElements,
					cleanRoot,
					island,
					replace,
					initialProps,
					widget,
					propsSelector,
				})

				island._roots = island._roots.concat(rootFragments)
				rendered = true
			}

			load()
			document.addEventListener('DOMContentLoaded', load)
			document.addEventListener('load', load)
		},
		rerender: (newProps) => {
			for (const rootFragment of island._roots) {
				renderIsland({
					island,
					widget,
					rootFragment,
					props: { ...island.props, ...newProps },
				})
			}
		},
		destroy: () => {
			for (const rootFragment of island._roots) {
				render(null, rootFragment)
			}
		},
	}

	return island
}
