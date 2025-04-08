import { router } from '../trpc'
import { allProjectProcedure } from './procedures/all-project'
import { createProjectProcedure } from './procedures/create-project'
import { getProjectProcedure } from './procedures/get-project'
export const projectRouter = router({
	createProject: createProjectProcedure,
	allProjects: allProjectProcedure,
	getProject: getProjectProcedure,
})
