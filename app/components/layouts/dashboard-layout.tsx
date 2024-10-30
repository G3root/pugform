import { IconDashboard } from 'justd-icons'
import type { ReactNode } from 'react'
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
			<span className="flex items-center">
				<Sidebar.Trigger className="-ml-1" />
			</span>
		</header>
	)
}

function AppSidebar() {
	return (
		<Sidebar intent="inset">
			<Sidebar.Content>
				<Sidebar.Section>
					<Sidebar.Item isCurrent icon={IconDashboard} href="#">
						Dashboard
					</Sidebar.Item>
				</Sidebar.Section>
				<Sidebar.Section collapsible title="Workspaces">
					<Sidebar.Item href="/dashboard/workspaces">
						All workspaces
					</Sidebar.Item>
				</Sidebar.Section>
			</Sidebar.Content>
		</Sidebar>
	)
}
