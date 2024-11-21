import type { Session, SessionUser } from '~/utils/session.server'

declare module 'react-router' {
	interface AppLoadContext {
		session: Session | null
		user: SessionUser | null
	}

	interface LoaderFunctionArgs {
		context: AppLoadContext
	}
	interface ActionFunctionArgs {
		context: AppLoadContext
	}
}
