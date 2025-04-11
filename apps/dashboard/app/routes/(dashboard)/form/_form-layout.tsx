import { db } from '@pugform/database'

import { Outlet } from 'react-router'
import { FormLayout as FormLayoutComponent } from '~/components/layouts/form-layout'
import { requireAuth } from '~/features/auth/api/require-auth.server'
import { getForm } from '~/trpc/.server/form-router/procedures/get-form'
import * as Errors from '~/utils/errors'
import type { Route } from './+types/_form-layout'

export async function loader({ request, params }: Route.LoaderArgs) {
	return requireAuth({ request })
		.andThen((session) => {
			return getForm({
				db,
				data: {
					formPublicId: params.formId as string,
					organizationId: session.session.activeOrganizationId,
				},
			})
		})
		.mapErr(Errors.mapRouteError)
		.match(
			(form) => {
				return {
					data: form,
					type: 'success' as const,
				}
			},
			(error) => {
				return {
					message: error.errorMsg,
					type: 'error' as const,
				}
			},
		)
}
export default function FormLayout() {
	return (
		<FormLayoutComponent>
			<Outlet />
		</FormLayoutComponent>
	)
}
