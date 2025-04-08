import { db } from '@pugform/database'
import { ServerValidateError } from '@tanstack/react-form/remix'
import { fromPromise } from 'neverthrow'
import { requireAuth } from '~/features/auth/api/require-auth.server'
import { RenameProjectServerValidate } from '~/features/project/validation.js'
import { renameProject } from '~/trpc/.server/project-router/procedures/rename-project.js'
import * as Errors from '~/utils/errors'
import type { Route } from './+types/rename-project.ts'

export async function action({ request }: Route.ActionArgs) {
	return requireAuth({ request })
		.andThen((session) => {
			return fromPromise(request.formData(), (e) =>
				Errors.badRequest('failed to parse form data'),
			).andThen((formData) => {
				return fromPromise(
					RenameProjectServerValidate(formData),
					(e) => e,
				).andThen((form) => {
					return renameProject({
						db,
						data: {
							...form,
							organizationId: session.session.activeOrganizationId,
						},
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
