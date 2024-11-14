import { reactRouter } from '@react-router/dev/vite'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
// import { remixDevTools } from 'remix-development-tools'
import { defineConfig } from 'vite'
import { envOnlyMacros } from 'vite-env-only'
import tsconfigPaths from 'vite-tsconfig-paths'
import type { Session, SessionUser } from '~/utils/session.server'

interface AppLoadContext {
	session: Session | null
	user: SessionUser | null
}

declare module 'react-router' {
	interface LoaderFunctionArgs {
		context: AppLoadContext
	}
	interface ActionFunctionArgs {
		context: AppLoadContext
	}

	interface AppLoadContext {
		session: Session | null
		user: SessionUser | null
	}
}

declare module 'react-router/types' {
	interface AppLoadContext {
		session: Session | null
		user: SessionUser | null
	}
}

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
