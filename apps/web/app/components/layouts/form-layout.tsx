import { useLocation, useParams } from '@remix-run/react'
import type { ReactNode } from 'react'
import { Tabs } from '~/components/ui/tabs'

interface FormLayoutProps {
	children: ReactNode
}

export function FormLayout({ children }: FormLayoutProps) {
	const params = useParams()
	const { pathname } = useLocation()
	const baseUrl = `/dashboard/forms/${params.formId}`
	return (
		<Tabs selectedKey={pathname} aria-label="forms navigation">
			<Tabs.List>
				<Tabs.Tab id={baseUrl} href={baseUrl}>
					Summary
				</Tabs.Tab>
				<Tabs.Tab id={`${baseUrl}/responses`} href={`${baseUrl}/responses`}>
					Responses
				</Tabs.Tab>
			</Tabs.List>

			<Tabs.Panel id={pathname}>{children}</Tabs.Panel>
		</Tabs>
	)
}
