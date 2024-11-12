import { useRouteLoaderData } from '@remix-run/react'
import { IconDashboard } from 'justd-icons'
import type { ReactNode } from 'react'
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

function AppSidebar() {
	return (
		<Sidebar>
			<Sidebar.Content>
				<Sidebar.Section>
					<Sidebar.Item icon={IconDashboard} href="/dashboard">
						Dashboard
					</Sidebar.Item>
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
		'./routes/(application)/(dashboard)/_layout',
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
