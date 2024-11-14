import { IconDashboard, IconSettings } from 'justd-icons'
import type { ReactNode } from 'react'
import { useRouteLoaderData } from 'react-router'
import { useCurrentRouteHandle } from '~/hooks/use-current-route-handle'
import type { TDashboardLoader } from '~/routes/(application)/(dashboard)/_layout'
import { Separator } from '../ui/separator'
import { Sidebar } from '../ui/sidebar'

interface DashboardLayoutProps {
	children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
	return (
		<Sidebar.Provider>
			<AppSidebar />
			<Sidebar.Inset>
				<Header />
				<div className="p-4 lg:p-6">{children}</div>
			</Sidebar.Inset>
		</Sidebar.Provider>
	)
}

function Header() {
	return (
		<header className="sticky justify-between sm:justify-start top-0 bg-bg h-[3.57rem] px-4 border-b flex items-center gap-x-2">
			<span className="flex items-center gap-x-3">
				<Sidebar.Trigger className="-mx-2" />
				<Separator className="h-6 sm:block hidden" orientation="vertical" />
			</span>
		</header>
	)
}

export const NavItems = [
	{
		label: 'Dashboard',
		href: '/dashboard',
		segment: 'dashboard',
		icon: IconDashboard,
	},
	{
		label: 'Settings',
		href: '/dashboard/settings',
		segment: 'settings',
		icon: IconSettings,
	},
]

function AppSidebar() {
	const segment = useCurrentRouteHandle<{ segment?: string }>()?.segment

	return (
		<Sidebar>
			<Sidebar.Content>
				<Sidebar.Section>
					{NavItems.map((item) => (
						<Sidebar.Item
							key={item.label}
							isCurrent={segment === item.segment}
							icon={item.icon}
							href={item.href}
						>
							{item.label}
						</Sidebar.Item>
					))}
				</Sidebar.Section>

				<Sidebar.Section collapsible title="Workspaces">
					<Sidebar.Item href="/dashboard/workspaces">
						All workspaces
					</Sidebar.Item>
					<WorkspaceList />
				</Sidebar.Section>
			</Sidebar.Content>
		</Sidebar>
	)
}

function WorkspaceList() {
	const data = useRouteLoaderData<TDashboardLoader>(
		'routes/(application)/(dashboard)/_layout',
	)
	return data && data.workspaces.length > 0
		? data.workspaces.map((item) => (
				<Sidebar.Item
					key={item.id}
					href={`/dashboard/workspaces/${item.publicId}`}
				>
					{item.name}
				</Sidebar.Item>
			))
		: null
}
