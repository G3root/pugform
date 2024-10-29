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

export default defineConfig({
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
			},
			routes(defineRoutes) {
				return defineRoutes((route) => {
					route('/', 'routes/_index.tsx', { index: true })
					route('dashboard/login', 'routes/(application)/(auth)/login.tsx', {
						index: true,
					})
					route(
						'dashboard',
						'routes/(application)/(dashboard)/_layout.tsx',
						() => {},
					)
				})
			},
		}),

		tsconfigPaths(),
	],
})
