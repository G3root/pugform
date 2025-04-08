import { projectRouter } from './project-router/router'
import { router } from './trpc'
export const appRouter = router({
	project: projectRouter,
})

export type AppRouter = typeof appRouter
