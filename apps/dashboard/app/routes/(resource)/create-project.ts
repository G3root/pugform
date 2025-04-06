import { db } from '@pugform/database'
import { ServerValidateError } from '@tanstack/react-form/remix'
import { fromPromise } from 'neverthrow'
import { requireAuth } from '~/features/auth/api/require-auth.server.js'
import { createProject } from '~/features/project/api/create-project.server.js'
import { CreateProjectServerValidate } from '~/features/project/validation'
import * as Errors from '~/utils/errors'
import type { Route } from './+types/create-project.ts'

export function action({ request }: Route.ActionArgs) {
	return requireAuth({ request })
		.andThen((session) => {
			return fromPromise(request.formData(), (e) =>
				Errors.badRequest('failed to parse form data'),
			).andThen((formData) => {
				return fromPromise(
					CreateProjectServerValidate(formData),
					(e) => e,
				).andThen((form) => {
					return createProject({
						data: {
							name: form.name,
							memberId: session.session.activeMemberId,
							organizationId: session.session.activeOrganizationId,
						},
						db,
					})
				})
			})
		})

		.match(
			() => {
				return null
			},
			(error) => {
				if (error instanceof ServerValidateError) {
					return error.formState
				}
				const mapped = Errors.mapRouteError(error as Errors.RouteError)
				return mapped.errorMsg
			},
		)
}
