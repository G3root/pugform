import { db } from '@pugform/database'
import { okAsync } from 'neverthrow'
import { Outlet } from 'react-router'
import { DashboardLayout as DashboardLayoutComponent } from '~/components/layouts/dashboard-layout'
import { requireAuth } from '~/features/auth/api/require-auth.server'
import { allProjects } from '~/features/project/api/all-project.server'
import * as Errors from '~/utils/errors'
import type { Route } from './+types/_layout'

export function loader({ request }: Route.LoaderArgs) {
	return requireAuth({ request })
		.andThen((session) => {
			return allProjects({
				db,
				data: {
					memberId: session.session.activeMemberId,
					organizationId: session.session.activeOrganizationId,
				},
			}).andThen((projects) => {
				return okAsync(projects)
			})
		})
		.mapErr(Errors.mapRouteError)
		.match(
			(projects) => {
				return {
					data: projects,
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

export default function DashboardLayout() {
	return (
		<DashboardLayoutComponent>
			<Outlet />
		</DashboardLayoutComponent>
	)
}
