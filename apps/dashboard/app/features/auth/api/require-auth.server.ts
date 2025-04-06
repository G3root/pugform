import { errAsync, fromPromise, okAsync } from 'neverthrow'
import { auth } from '~/lib/auth'
import * as Errors from '~/utils/errors'

export function requireAuth({ request }: { request: Request }) {
	return fromPromise(auth.api.getSession({ headers: request.headers }), (e) => {
		return Errors.unauthorized('Authentication required')
	}).andThen((session) => {
		if (!session) {
			return errAsync(Errors.unauthorized('Authentication required'))
		}

		if (!session.session.activeOrganizationId) {
			return errAsync(Errors.unauthorized('Organization not found'))
		}

		if (!session.session.activeMemberId) {
			return errAsync(Errors.unauthorized('Member not found'))
		}

		return okAsync({
			...session,
			session: {
				...session.session,
				activeOrganizationId: session.session.activeOrganizationId,
				activeMemberId: session.session.activeMemberId,
			},
		})
	})
}
