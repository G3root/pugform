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
				unstable_routeConfig: true,
			},
		}),
		vanillaExtractPlugin(),
		tsconfigPaths(),
	],
})
