import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { builderRouter } from '~/modules/builder/procedures/_router'
import { formRouter } from '~/modules/form/procedures/_router'
import { workspaceRouter } from '~/modules/workspace/procedures/_router'
import { createTRPCRouter } from '../init'

export const appRouter = createTRPCRouter({
	builder: builderRouter,
	workspace: workspaceRouter,
	form: formRouter,
})

export type AppRouter = typeof appRouter
export type RouterInput = inferRouterInputs<AppRouter>
export type RouterOutput = inferRouterOutputs<AppRouter>
