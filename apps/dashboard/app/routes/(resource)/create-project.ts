import { db } from '@pugform/database'
import { ServerValidateError } from '@tanstack/react-form/remix'
import { fromPromise } from 'neverthrow'
import { requireAuth } from '~/features/auth/api/require-auth.server'
import { CreateProjectServerValidate } from '~/features/project/validation'
import { createProject } from '~/trpc/.server/project-router/procedures/create-project'
import * as Errors from '~/utils/errors'
import type { Route } from './+types/create-project'

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
