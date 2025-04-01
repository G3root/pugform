import { Outlet } from 'react-router'
import { DashboardLayout as DashboardLayoutComponent } from '~/components/layouts/dashboard-layout'

export default function DashboardLayout() {
	return (
		<DashboardLayoutComponent>
			<Outlet />
		</DashboardLayoutComponent>
	)
}
