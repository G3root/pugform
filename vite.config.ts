import { vitePlugin as remix } from '@remix-run/dev'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
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
					route(':formId', 'routes/(subDomain)/public-form-view.tsx', {
						index: true,
					})
					route('dashboard/login', buildApplicationPath('auth', 'login.tsx'), {
						index: true,
					})
					route(
						'dashboard/sign-up',
						buildApplicationPath('auth', 'sign-up.tsx'),
						{
							index: true,
						},
					)
					route(
						'dashboard/onboarding',
						buildApplicationPath('auth', 'onboarding.tsx'),
						{
							index: true,
						},
					)

					route(
						'dashboard/verify-email',
						buildApplicationPath('auth', 'verify-email.tsx'),
						{
							index: true,
						},
					)

					route(
						'dashboard/forms/:formId/edit',
						buildApplicationPath('dashboard', 'forms/form-edit.tsx'),
						{
							index: true,
						},
					)
					route(
						'dashboard',
						buildApplicationPath('dashboard', '_layout.tsx'),
						() => {
							route('', buildApplicationPath('dashboard', 'dashboard.tsx'), {
								index: true,
							})

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
							route(
								'workspaces/:workspaceId/form',
								buildApplicationPath('dashboard', 'forms/create-form.tsx'),
								{
									index: true,
								},
							)

							route(
								'forms/:formId',
								buildApplicationPath('dashboard', 'forms/_layout.tsx'),
								() => {
									route(
										'',
										buildApplicationPath('dashboard', 'forms/form-summary.tsx'),
										{
											index: true,
										},
									)
									route(
										'responses',
										buildApplicationPath(
											'dashboard',
											'forms/form-responses.tsx',
										),
										{
											index: true,
										},
									)
								},
							)
						},
					)
				})
			},
		}),
		vanillaExtractPlugin(),
		tsconfigPaths(),
	],
})
