import {
	RiDeleteBinLine,
	RiEditLine,
	RiLinksLine,
	RiMoreLine,
} from '@remixicon/react'
import {
	Link,
	useLoaderData,
	useLocation,
	useNavigate,
	useParams,
} from 'react-router'
import { toast } from 'sonner'
import { useCopyToClipboard } from '~/hooks/use-copy-to-clipboard'
import type { Info } from '../../../.react-router/types/app/routes/(dashboard)/form/+types/_form-layout'
import { Button, buttonVariants } from '../ui/button'
import { Container } from '../ui/container'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Stack } from '../ui/stack'

export function FormLayout({ children }: { children: React.ReactNode }) {
	const data = useLoaderData<Info['loaderData']>()

	if (data.type === 'error') {
		throw new Error(data.message)
	}

	return (
		<Container>
			<Stack>
				<Stack direction="row" justify="between" align="center">
					<Stack direction="row" gap={2}>
						<h1 className="font-bold text-xl tracking-tight sm:text-2xl">
							{data.data.name}
						</h1>

						<div>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button size="icon" variant="ghost">
										<RiMoreLine />
										<span className="sr-only">More options</span>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent>
									<RenameFormMenuButton formPublicId={data.data.publicId} />
									{/* <DeleteFormMenuButton
									projectPublicId={data.data.projectPublicId}
									formPublicId={params.formId}
								/> */}
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</Stack>

					<Stack gap={2} direction="row" align="center">
						<CopyLinkButton />

						<Link to={'/'} className={buttonVariants()}>
							Edit
						</Link>
					</Stack>
				</Stack>
				{/* <NavTabs>{children}</NavTabs> */}
				{children}
			</Stack>
		</Container>
	)
}

function CopyLinkButton() {
	const copy = useCopyToClipboard()[1]
	return (
		<Button
			onClick={() => {
				const promise = () => new Promise((resolve) => resolve(copy('')))
				toast.promise(promise, {
					loading: 'Copying link...',
					success: 'Link copied to clipboard successfully',
					error: 'Error copying link',
				})
				toast.promise(new Promise(() => copy('')))
			}}
			variant="outline"
			size="icon"
		>
			<RiLinksLine />
			<span className="sr-only">Share</span>
		</Button>
	)
}

interface RenameFormMenuButtonProps {
	formPublicId: string
}

function RenameFormMenuButton({ formPublicId }: RenameFormMenuButtonProps) {
	const location = useLocation()
	const navigate = useNavigate()
	return (
		<DropdownMenuItem
			onSelect={() => {
				navigate(`${location.pathname}?rename-form=true&fid=${formPublicId}`)
			}}
		>
			<RiEditLine />
			Rename
		</DropdownMenuItem>
	)
}

function DeleteFormButton() {
	return <Button>Delete</Button>
}
