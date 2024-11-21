import { IconChainLink, IconDotsHorizontal } from 'justd-icons'
import { type ReactNode, useState } from 'react'
import { Link, useLoaderData, useLocation, useParams } from 'react-router'
import { toast } from 'sonner'
import { Tabs } from '~/components/ui/tabs'
import { useCopyToClipboard } from '~/hooks/use-copy-to-clipboard'
import { FormDeleteDialog } from '~/modules/form/components/form-delete-dialog'
import { FormRenameDialog } from '~/modules/form/components/form-rename-dialog'
import { Button, buttonStyles } from '../ui/button'
import { Heading } from '../ui/heading'
import { Menu } from '../ui/menu'
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
				<Stack direction="row" gap={2}>
					<Heading>{data.form.title}</Heading>
					<ActionMenu />
				</Stack>

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

function ActionMenu() {
	const [openRename, setOpenRename] = useState(false)
	const [openDelete, setOpenDelete] = useState(false)
	const data = useLoaderData<Info['loaderData']>()

	return (
		<>
			<Menu>
				<Button size="square-petite" appearance="plain">
					<IconDotsHorizontal />
				</Button>
				<Menu.Content aria-label="Actions">
					<Menu.Item
						onAction={() => {
							setOpenRename(true)
						}}
					>
						Rename
					</Menu.Item>
					<Menu.Separator />
					<Menu.Item
						isDanger
						onAction={() => {
							setOpenDelete(true)
						}}
					>
						Delete
					</Menu.Item>
				</Menu.Content>
			</Menu>
			<FormRenameDialog
				id={data.form.id}
				isOpen={openRename}
				onOpenChange={setOpenRename}
				defaultValue={data.form.title}
			/>

			<FormDeleteDialog
				isOpen={openDelete}
				onOpenChange={setOpenDelete}
				id={data.form.id}
				redirectTo={`/dashboard/workspaces/${data.form.workspace.publicId}`}
			/>
		</>
	)
}
