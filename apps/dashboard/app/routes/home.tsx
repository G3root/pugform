import type { Route } from './+types/home'

export function meta(metaArgs: Route.MetaArgs) {
	return [
		{ title: 'New React Router App' },
		{ name: 'description', content: 'Welcome to React Router!' },
	]
}

export default function Home() {
	return <div>hello world</div>
}
