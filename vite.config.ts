import { vitePlugin as remix } from '@remix-run/dev'
import { remixDevTools } from 'remix-development-tools'
import { defineConfig } from 'vite'
import { envOnlyMacros } from 'vite-env-only'
import tsconfigPaths from 'vite-tsconfig-paths'

declare module '@remix-run/node' {
	interface Future {
		v3_singleFetch: true
	}
}

const applicationBasePath = 'routes/(application)/'
const buildApplicationPath = (segment: 'auth' | 'dashboard', path: string) =>
	`${applicationBasePath}(${segment})/${path}`

export default defineConfig({
	optimizeDeps: {
		exclude: ['@node-rs/argon2'],
	},
	plugins: [
		envOnlyMacros(),
		remixDevTools(),
		remix({
			ignoredRouteFiles: ['**/*'],
			serverModuleFormat: 'esm',
			future: {
				v3_fetcherPersist: true,
				v3_relativeSplatPath: true,
				v3_throwAbortReason: true,
				v3_singleFetch: true,
				v3_lazyRouteDiscovery: true,
				unstable_optimizeDeps: true,
			},
			routes(defineRoutes) {
				return defineRoutes((route) => {
					route('/', 'routes/_index.tsx', { index: true })
					route('dashboard/login', buildApplicationPath('auth', 'login.tsx'), {
						index: true,
					})
					route(
						'dashboard/forms/create',
						buildApplicationPath('dashboard', 'forms/create.tsx'),
						{
							index: true,
						},
					)
					route(
						'dashboard',
						buildApplicationPath('dashboard', '_layout.tsx'),
						() => {
							route(
								'workspaces',
								buildApplicationPath(
									'dashboard',
									'workspace/all-workspaces.tsx',
								),
								{
									index: true,
								},
							)
							route(
								'workspaces/:workspaceId',
								buildApplicationPath(
									'dashboard',
									'workspace/[workspaceId].tsx',
								),
								{
									index: true,
								},
							)
						},
					)
				})
			},
		}),

		tsconfigPaths(),
	],
})
