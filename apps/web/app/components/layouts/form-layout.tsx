import { IconChainLink } from 'justd-icons'
import type { ReactNode } from 'react'
import { Link, useLoaderData, useLocation, useParams } from 'react-router'
import { toast } from 'sonner'
import { Tabs } from '~/components/ui/tabs'
import { useCopyToClipboard } from '~/hooks/use-copy-to-clipboard'
import { Button, buttonStyles } from '../ui/button'
import { Heading } from '../ui/heading'
import { Stack } from '../ui/stack'
import type { Info } from '.react-router/types/app/routes/(application)/(dashboard)/forms/+types/_layout'
interface FormLayoutProps {
	children: ReactNode
}

export function FormLayout({ children }: FormLayoutProps) {
	const data = useLoaderData<Info['loaderData']>()
	const params = useParams<{ formId: string }>()
	const copy = useCopyToClipboard()[1]

	return (
		<Stack>
			<Stack direction="row" justify="between" align="center">
				<Heading>{data.form.title}</Heading>

				<Stack gap={2} direction="row" align="center">
					<Button
						aria-label="copy link to share"
						appearance="outline"
						size="square-petite"
						onPress={() => {
							const promise = () =>
								new Promise((resolve) => resolve(copy(data.form.shareLink)))
							toast.promise(promise, {
								loading: 'Copying link...',
								success: 'Link copied to clipboard successfully',
								error: 'Error copying link',
							})
							toast.promise(new Promise(() => copy(data.form.shareLink)))
						}}
					>
						<IconChainLink />
					</Button>
					<Link
						to={`/dashboard/forms/${params.formId}/edit`}
						className={buttonStyles({ size: 'small' })}
					>
						Edit
					</Link>
				</Stack>
			</Stack>
			<NavTabs>{children}</NavTabs>
		</Stack>
	)
}

interface NavTabsProps {
	children: ReactNode
}

function NavTabs({ children }: NavTabsProps) {
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
				<Tabs.Tab
					id={`${baseUrl}/integrations`}
					href={`${baseUrl}/integrations`}
				>
					Integrations
				</Tabs.Tab>
			</Tabs.List>

			<Tabs.Panel id={pathname}>{children}</Tabs.Panel>
		</Tabs>
	)
}
