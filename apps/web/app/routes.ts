import {
	type RouteConfig,
	index,
	layout,
	prefix,
	route,
} from '@remix-run/route-config'

const ROUTES_DIR = './routes'
const APPLICATION_DIR = '(application)'
const AUTH_SEGMENT = 'auth'
const DASHBOARD_SEGMENT = 'dashboard'

const buildPath = (...segments: string[]) => segments.join('/')

const buildRoutePath = (path: string) => buildPath(ROUTES_DIR, path)

const buildApplicationRoutePath = (
	segment: typeof AUTH_SEGMENT | typeof DASHBOARD_SEGMENT,
	path: string,
) => {
	return buildPath(ROUTES_DIR, APPLICATION_DIR, `(${segment})`, path)
}

const authRoutes = [
	route('login', buildApplicationRoutePath(AUTH_SEGMENT, 'login.tsx')),
	route('sign-up', buildApplicationRoutePath(AUTH_SEGMENT, 'sign-up.tsx')),
	route(
		'onboarding',
		buildApplicationRoutePath(AUTH_SEGMENT, 'onboarding.tsx'),
	),
	route(
		'verify-email',
		buildApplicationRoutePath(AUTH_SEGMENT, 'verify-email.tsx'),
	),
]

const formRoutes = [
	layout(buildApplicationRoutePath(DASHBOARD_SEGMENT, 'forms/_layout.tsx'), [
		index(
			buildApplicationRoutePath(DASHBOARD_SEGMENT, 'forms/form-summary.tsx'),
		),
		route(
			'responses',
			buildApplicationRoutePath(DASHBOARD_SEGMENT, 'forms/form-responses.tsx'),
		),
	]),
]

const workspaceRoutes = prefix('workspaces', [
	index(
		buildApplicationRoutePath(
			DASHBOARD_SEGMENT,
			'workspace/all-workspaces.tsx',
		),
	),
	...prefix(':workspaceId', [
		index(
			buildApplicationRoutePath(
				DASHBOARD_SEGMENT,
				'workspace/[workspaceId].tsx',
			),
		),
		route(
			'form',
			buildApplicationRoutePath(DASHBOARD_SEGMENT, 'forms/create-form.tsx'),
		),
	]),
])

const settingsRoutes = [
	index(buildApplicationRoutePath(DASHBOARD_SEGMENT, 'settings/profile.tsx')),
]

const dashboardRoutes = [
	route(
		'forms/:formId/edit',
		buildApplicationRoutePath(DASHBOARD_SEGMENT, 'forms/form-edit.tsx'),
	),
	layout(buildApplicationRoutePath(DASHBOARD_SEGMENT, '_layout.tsx'), [
		index(buildApplicationRoutePath(DASHBOARD_SEGMENT, 'dashboard.tsx')),
		...workspaceRoutes,
		...prefix('settings', [...settingsRoutes]),
		...prefix('forms/:formId', formRoutes),
	]),
]

export const routes: RouteConfig = [
	index(buildRoutePath('_index.tsx')),
	route(':formId', buildRoutePath('(subDomain)/public-form-view.tsx')),
	...prefix('dashboard', [...authRoutes, ...dashboardRoutes]),
]
