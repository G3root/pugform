import { db } from '@pugform/database'
import { Link, useLoaderData, useLocation, useParams } from 'react-router'
import { Button, buttonVariants } from '~/components/ui/button'
import { Container } from '~/components/ui/container'
import { Separator } from '~/components/ui/separator'
import { Stack } from '~/components/ui/stack'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '~/components/ui/table'
import { requireAuth } from '~/features/auth/api/require-auth.server'
import { getProject } from '~/trpc/.server/project-router/procedures/get-project'
import * as Errors from '~/utils/errors'
import type { Route } from './+types/project-detail'

export function loader({ request, params }: Route.LoaderArgs) {
	return requireAuth({ request })
		.andThen((session) => {
			return getProject({
				db,
				data: {
					publicId: params.projectId,
					organizationId: session.session.activeOrganizationId,
				},
			})
		})
		.mapErr(Errors.mapRouteError)
		.match(
			(project) => {
				return {
					data: project,
					type: 'success' as const,
				}
			},
			(error) => {
				return {
					message: error.errorMsg,
					type: 'error' as const,
				}
			},
		)
}

export default function ProjectDetail() {
	const data = useLoaderData<typeof loader>()

	if (data.type === 'error') {
		throw new Error(data.message)
	}

	return (
		<Container>
			<Stack direction="column" gap={4}>
				<Stack direction="row" justify="between" align="center">
					<h1 className="font-bold text-2xl">{data.data.name}</h1>
					<Stack>
						<CreateFormButton />
					</Stack>
				</Stack>

				<Separator />
				<Stack direction="column" gap={4}>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Name</TableHead>
								<TableHead>Description</TableHead>
								<TableHead>Created At</TableHead>
								<TableHead>Updated At</TableHead>
								<TableHead>Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{data.data.forms.map((form) => (
								<TableRow key={form.id}>
									<TableCell>{form.name}</TableCell>
									<TableCell>{form.description}</TableCell>
									<TableCell>
										{new Date(form.createdAt).toLocaleDateString()}
									</TableCell>
									<TableCell>
										{new Date(form.updatedAt).toLocaleDateString()}
									</TableCell>
									<TableCell>
										<Stack direction="row" gap={2}>
											<Link
												className={buttonVariants({ variant: 'outline' })}
												to={`/forms/${form.publicId}`}
											>
												View
											</Link>
											<Button variant="outline">Edit</Button>
											<Button variant="outline">Delete</Button>

											<RenameFormButton
												formPublicId={form.publicId}
												projectPublicId={data.data.publicId}
											/>
										</Stack>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</Stack>
			</Stack>
		</Container>
	)
}

function RenameFormButton({
	formPublicId,
	projectPublicId,
}: {
	formPublicId: string
	projectPublicId: string
}) {
	const location = useLocation()

	return (
		<Link
			to={`${location.pathname}?rename-form=true&pid=${projectPublicId}&fid=${formPublicId}`}
			className={buttonVariants({ variant: 'outline' })}
		>
			Rename
		</Link>
	)
}

function CreateFormButton() {
	const location = useLocation()
	const params = useParams<{ projectId: string }>()

	return (
		<Link
			className={buttonVariants({ variant: 'outline' })}
			to={`${location.pathname}?create-form=true&pid=${params.projectId}`}
		>
			Create Form
		</Link>
	)
}
