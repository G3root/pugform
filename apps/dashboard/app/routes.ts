import {
	type RouteConfig,
	index,
	layout,
	prefix,
	route,
} from '@react-router/dev/routes'

const DASHBOARD_DIR = '(dashboard)'
const API_DIR = '(api)'
const AUTH_DIR = '(auth)'
const ROUTES_DIR = 'routes'

const buildPath = (...segments: string[]) => segments.join('/')

const buildRoutePath = (path: string) => buildPath(ROUTES_DIR, path)

const buildApplicationRoutePath = (path: string) => {
	return buildPath(ROUTES_DIR, DASHBOARD_DIR, path)
}

const buildAuthRoutePath = (path: string) => {
	return buildPath(ROUTES_DIR, AUTH_DIR, path)
}

const buildApiRoutePath = (path: string) => {
	return buildPath(ROUTES_DIR, API_DIR, path)
}

const apiRoutes = [
	route('/auth/*', buildApiRoutePath('auth.ts')),
] satisfies RouteConfig

const dashboardRoutes = [
	index(buildApplicationRoutePath('dashboard.tsx')),
] satisfies RouteConfig

const authRoutes = [
	route('/sign-up', buildAuthRoutePath('sign-up.tsx')),
	route('/login', buildAuthRoutePath('login.tsx')),
] satisfies RouteConfig

export default [
	...prefix('/api', apiRoutes),
	...authRoutes,
	layout(buildApplicationRoutePath('_layout.tsx'), dashboardRoutes),
] satisfies RouteConfig
