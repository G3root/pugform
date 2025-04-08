import { db } from '@pugform/database'
import { useLoaderData } from 'react-router'
import { Button } from '~/components/ui/button'
import { Container } from '~/components/ui/container'
import { Separator } from '~/components/ui/separator'
import { Stack } from '~/components/ui/stack'
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
						<Button variant="outline">Create Form</Button>
					</Stack>
				</Stack>

				<Separator />
			</Stack>
		</Container>
	)
}
