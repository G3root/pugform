import { type ComponentType, h, render } from 'preact'

type HostElement = HTMLElement
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type InitialProps = { [x: string]: any }

export type Island<P extends InitialProps> = {
	render: (props: {
		selector?: string
		inline?: boolean
		initialProps?: Partial<P>
		cleanRoot?: boolean
		replace?: boolean
		propsSelector?: string | undefined | null
	}) => void
	_roots: TRootFragment[]

	_executedScript: HTMLScriptElement | null
	props: P
	rerender: (props: P) => void
	destroy: () => void
}

export const formatProp = (str: string) => {
	return `${str.charAt(0).toLowerCase()}${str.slice(1)}`
}

export const getPropsFromScripts = (
	scripts: HTMLScriptElement[],
): InitialProps => {
	return scripts.reduce((props, script) => {
		try {
			// biome-ignore lint/performance/noAccumulatingSpread: <explanation>
			return { ...props, ...JSON.parse(script.innerHTML) }
		} catch {
			return props
		}
	}, {})
}

export const getPropsScriptsBySelector = (
	selector: string,
): HTMLScriptElement[] => {
	return Array.from(document.querySelectorAll(selector)).filter(
		(element): element is HTMLScriptElement =>
			element instanceof HTMLScriptElement &&
			['text/props', 'application/json'].includes(element.type),
	)
}

export const getPropsFromElement = (element: HTMLElement): InitialProps => {
	const { dataset } = element
	const props: InitialProps = {}

	for (const key in dataset) {
		if (key in dataset) {
			const propName = formatProp(key.split(/(props?)/).pop() || '')
			if (propName) {
				props[propName] = dataset[key] || ''
			}
		}
	}

	return props
}

export const isValidPropsScript = (element: Element) => {
	return (
		// element.tagName.toLowerCase() === 'script' &&
		['text/props', 'application/json'].includes(
			element.getAttribute('type') || '',
		)
	)
}

export const getInteriorPropsScripts = (
	element: HTMLElement,
): HTMLScriptElement[] => {
	return Array.from(element.getElementsByTagName('script')).filter(
		(script): script is HTMLScriptElement =>
			['text/props', 'application/json'].includes(script.type),
	)
}

export const generateElementProps = <P extends InitialProps>(
	island: Island<P>,
	element: HostElement,
	propsSelector: string | undefined | null,
	initialProps = {},
): P => {
	const elementProps = getPropsFromElement(element)
	const currentScriptProps = island._executedScript
		? getPropsFromElement(island._executedScript)
		: {}
	const interiorScriptProps = getPropsFromScripts(
		getInteriorPropsScripts(element),
	)
	const propsSelectorProps = propsSelector
		? getPropsFromScripts(getPropsScriptsBySelector(propsSelector))
		: {}

	return {
		...initialProps,
		...elementProps,
		...currentScriptProps,
		...propsSelectorProps,
		...interiorScriptProps,
	} as P
}

export const getCurrentScript = (): HTMLScriptElement | null => {
	return (
		(document.currentScript as HTMLScriptElement) ||
		document.getElementsByTagName('script')[
			document.getElementsByTagName('script').length - 1
		]
	)
}

type TRootFragment = ReturnType<typeof createRootFragment>

function createRootFragment(
	parent: HostElement,
	replaceNode: HostElement | HostElement[],
) {
	const replaceNodes: HostElement[] = ([] as HostElement[]).concat(replaceNode)
	const s = replaceNodes[replaceNodes.length - 1].nextSibling
	function insert(c: Node, r: Node | null) {
		return parent.insertBefore(c, r || s)
	}
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	// biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
	return ((parent as any).__k = {
		nodeType: 1,
		parentNode: parent,
		firstChild: replaceNodes[0],
		childNodes: replaceNodes,
		contains: (c: Node) => parent.contains(c),
		insertBefore: insert,
		appendChild: (c: Node) => insert(c, null),
		removeChild: (c: Node) => parent.removeChild(c),
	})
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type RootFragment = any

export const renderIsland = <P extends InitialProps>({
	island,
	widget,
	rootFragment,
	props,
}: {
	island: Island<P>
	widget: ComponentType<P>
	rootFragment: RootFragment
	props: P
}) => {
	island.props = props
	render(h(widget, props), rootFragment)
}

export const mount = <P extends InitialProps>({
	hostElements,
	cleanRoot,
	replace,
	widget,
	island,
	initialProps,
	propsSelector,
}: {
	hostElements: Array<HostElement>
	cleanRoot: boolean
	replace: boolean
	widget: ComponentType<P>
	island: Island<P>
	initialProps: P | Partial<P>
	propsSelector: string | undefined | null
}) => {
	const rootFragments = []

	for (const hostElement of hostElements) {
		const props = generateElementProps<P>(
			island,
			hostElement,
			propsSelector,
			initialProps,
		)

		if (cleanRoot) {
			hostElement.innerHTML = ''
		}

		const rootFragment = replace
			? createRootFragment(
					hostElement.parentElement || document.body,
					hostElement,
				)
			: createRootFragment(
					hostElement,
					(() => {
						const renderNode = document.createElement('div')
						hostElement.appendChild(renderNode)
						return renderNode
					})(),
				)

		rootFragments.push(rootFragment)

		renderIsland({ island, props, rootFragment, widget })
	}

	return { rootFragments }
}

export const getHostElements = ({
	selector,
	inline,
}: {
	selector?: string
	inline: boolean
}): HTMLElement[] => {
	const currentScript = getCurrentScript()

	if (inline && currentScript?.parentNode instanceof HTMLElement) {
		return [currentScript.parentNode]
	}

	const scriptSelector = currentScript?.dataset.mountIn
	if (scriptSelector) {
		return Array.from(document.querySelectorAll<HTMLElement>(scriptSelector))
	}

	if (selector) {
		return Array.from(document.querySelectorAll<HTMLElement>(selector))
	}

	return []
}
