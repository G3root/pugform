import { router } from '../trpc'
import { allProjectProcedure } from './procedures/all-project'
import { createProjectProcedure } from './procedures/create-project'

export const projectRouter = router({
	createProject: createProjectProcedure,
	allProjects: allProjectProcedure,
})
