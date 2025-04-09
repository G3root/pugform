import { formRouter } from './form-router/router'
import { projectRouter } from './project-router/router'
import { router } from './trpc'
export const appRouter = router({
	project: projectRouter,
	form: formRouter,
})

export type AppRouter = typeof appRouter
