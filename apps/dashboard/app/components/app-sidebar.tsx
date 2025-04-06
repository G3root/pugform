import type * as React from 'react'

import {
	RiAddCircleLine,
	RiArrowRightSLine,
	RiPulseLine,
	RiSettings3Line,
	RiSlowDownLine,
} from '@remixicon/react'
import {
	Link,
	href,
	useLoaderData,
	useLocation,
	useMatches,
	useRouteLoaderData,
} from 'react-router'
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from '~/components/ui/sidebar'
import { CreateProjectSheet } from '~/features/project/components/sheets/create-project-sheet'
import { useCurrentRouteHandle } from '~/hooks/use-current-route-handle'
import { authClient } from '~/lib/auth-client'
import { NavUser } from './nav-user'

import type { Info as LayoutRouteInfo } from '../../.react-router/types/app/routes/(dashboard)/+types/_layout'
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from './ui/collapsible'

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
				<SidebarGroup>
					<div className="flex items-center justify-between">
						<SidebarGroupLabel className="text-muted-foreground/65 uppercase">
							Projects
						</SidebarGroupLabel>

						<div>
							<CreateProjectButton />
						</div>
					</div>
					<SidebarGroupContent>
						<SidebarMenu>
							<ProjectList />
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<UserMenu />
			</SidebarFooter>
			<CreateProjectSheet />
		</Sidebar>
	)
}

function CreateProjectButton() {
	const location = useLocation()

	return (
		<SidebarMenuButton asChild>
			<Link to={`${location.pathname}?create-project=true`}>
				<RiAddCircleLine size={22} />
			</Link>
		</SidebarMenuButton>
	)
}

function ProjectList() {
	const loaderId: LayoutRouteInfo['id'] = 'routes/(dashboard)/_layout'
	const loader = useRouteLoaderData<LayoutRouteInfo['loaderData']>(loaderId)

	if (!loader || loader?.type === 'error') {
		return null
	}

	return loader.data.map((project) => (
		// <SidebarMenuItem key={project.id}>
		// 	<SidebarMenuButton asChild>
		// 		<a href="#" title={project.name}>
		// 			<span>{project.name}</span>
		// 		</a>
		// 	</SidebarMenuButton>
		// </SidebarMenuItem>

		<Collapsible key={project.id}>
			<SidebarMenuItem>
				<SidebarMenuButton asChild>
					<Link
						to={href('/projects/:projectId', { projectId: project.publicId })}
					>
						<span className="ml-6">{project.name}</span>
					</Link>
				</SidebarMenuButton>
				<CollapsibleTrigger asChild>
					<SidebarMenuAction className="left-2 bg-sidebar-accent text-sidebar-accent-foreground data-[state=open]:rotate-90">
						<RiArrowRightSLine />
					</SidebarMenuAction>
				</CollapsibleTrigger>
				<SidebarMenuAction showOnHover>
					<RiPulseLine />
				</SidebarMenuAction>
				<CollapsibleContent>
					<div>
						<h1>Hello</h1>
					</div>
				</CollapsibleContent>
			</SidebarMenuItem>
		</Collapsible>
	))
}

function UserMenu() {
	const {
		data: session,
		isPending, //loading state
		error, //error object
		refetch, //refetch the session
	} = authClient.useSession()

	return (
		<NavUser
			name={session?.user?.name ?? 'John Doe'}
			email={session?.user?.email ?? 'john.doe@example.com'}
			avatar={session?.user?.image ?? 'https://github.com/shadcn.png'}
		/>
	)
}
