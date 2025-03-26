import {
	type RouteConfig,
	index,
	prefix,
	route,
} from '@react-router/dev/routes'

const apiRoutes = [route('/auth/*', 'routes/api/auth.ts')] satisfies RouteConfig

export default [
	...prefix('/api', apiRoutes),
	index('routes/home.tsx'),
] satisfies RouteConfig
