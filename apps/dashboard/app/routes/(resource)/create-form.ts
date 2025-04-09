import { db } from '@pugform/database'
import { ServerValidateError } from '@tanstack/react-form/remix'
import { fromPromise } from 'neverthrow'
import { requireAuth } from '~/features/auth/api/require-auth.server'
import { CreateFormFormServerValidate } from '~/features/form/validation'
import { createForm } from '~/trpc/.server/form-router/procedures/create-form'
import * as Errors from '~/utils/errors'
import type { Route } from './+types/create-form'

export function action({ request }: Route.ActionArgs) {
	return requireAuth({ request })
		.andThen((session) => {
			return fromPromise(request.formData(), (e) =>
				Errors.badRequest('failed to parse form data'),
			).andThen((formData) => {
				return fromPromise(
					CreateFormFormServerValidate(formData),
					(e) => e,
				).andThen((form) => {
					return createForm({
						data: {
							name: form.name,
							memberId: session.session.activeMemberId,
							organizationId: session.session.activeOrganizationId,
							projectPublicId: form.projectPublicId,
							description: form.description,
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
