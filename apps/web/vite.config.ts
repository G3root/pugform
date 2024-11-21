import { reactRouter } from '@react-router/dev/vite'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
// import { remixDevTools } from 'remix-development-tools'
import { defineConfig } from 'vite'
import { envOnlyMacros } from 'vite-env-only'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
	optimizeDeps: {
		exclude: ['@node-rs/argon2'],
	},
	plugins: [
		envOnlyMacros(),
		// remixDevTools(),
		reactRouter(),
		vanillaExtractPlugin(),
		tsconfigPaths(),
	],
})
