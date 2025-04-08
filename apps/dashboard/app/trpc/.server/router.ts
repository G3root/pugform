import { projectRouter } from './project-router/router'
import { protectedProcedure, router } from './trpc'
const appRouter = router({
	project: projectRouter,
})

export type AppRouter = typeof appRouter
