import { Outlet } from 'react-router';
import { DashboardLayout as DashboardLayoutComponent } from '~/components/layouts/dashboard-layout'

import type { LoaderFunctionArgs } from 'react-router';
import { trpcServer } from '~/trpc/server'
import { requireAuth } from '~/utils/auth.server'

export async function loader({ request, context }: LoaderFunctionArgs) {
	requireAuth(context)
	const data = await trpcServer({ context, request }).workspace.all()
	return {
		...data,
	}
}

export type TDashboardLoader = typeof loader

export default function DashboardLayout() {
	return (
		<DashboardLayoutComponent>
			<Outlet />
		</DashboardLayoutComponent>
	)
}
