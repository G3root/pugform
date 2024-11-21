import { Outlet } from 'react-router'

import { FormLayout as FormLayoutComponent } from '~/components/layouts/form-layout'

import type { AppLoadContext, LoaderFunctionArgs } from 'react-router'

import { trpcServer } from '~/trpc/server'
import { requireAuth } from '~/utils/auth.server'
import type { Route } from './+types/_layout'

export async function loader({ request, context, params }: Route.LoaderArgs) {
	requireAuth(context)

	const { data } = await trpcServer({ context, request }).form.getFormData(
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		params as any,
	)
	return data
}

export default function FormLayout() {
	return (
		<FormLayoutComponent>
			<Outlet />
		</FormLayoutComponent>
	)
}
