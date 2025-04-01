import type * as React from 'react'

import { RiSettings3Line, RiSlowDownLine } from '@remixicon/react'
import { Link } from 'react-router'
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from '~/components/ui/sidebar'
import { useCurrentRouteHandle } from '~/hooks/use-current-route-handle'

const data = {
	navMain: [
		{
			title: 'General',
			items: [
				{
					title: 'Dashboard',
					url: '/',
					icon: RiSlowDownLine,
					segment: 'dashboard',
				},
				{
					title: 'Settings',
					url: '/settings',
					icon: RiSettings3Line,
					segment: 'settings',
				},
			],
		},
	],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const segment = useCurrentRouteHandle<{ segment?: string }>()?.segment

	return (
		<Sidebar {...props}>
			<SidebarHeader>
				{/* <TeamSwitcher teams={data.teams} />
				<hr className="-mt-px mx-2 border-border border-t" />
				<SearchForm className="mt-3" /> */}
			</SidebarHeader>
			<SidebarContent className="-mt-2">
				{data.navMain.map((item) => (
					<SidebarGroup key={item.title}>
						<SidebarGroupLabel className="text-muted-foreground/65 uppercase">
							{item.title}
						</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{item.items.map((item) => (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton
											asChild
											className="group/menu-button h-9 gap-3 font-medium group-data-[collapsible=icon]:px-[5px]! [&>svg]:size-auto"
											tooltip={item.title}
											isActive={segment === item.segment}
										>
											<Link to={item.url}>
												{item.icon && (
													<item.icon
														className="text-muted-foreground/65 group-data-[active=true]/menu-button:text-primary"
														size={22}
														aria-hidden="true"
													/>
												)}
												<span>{item.title}</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				))}
			</SidebarContent>
			<SidebarFooter>{/* <NavUser user={data.user} /> */}</SidebarFooter>
		</Sidebar>
	)
}
