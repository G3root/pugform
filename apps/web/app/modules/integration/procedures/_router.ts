import { createTRPCRouter } from '~/trpc/init'
import { AddIntegrationProcedure } from './add-integration'
import { AllIntegrationProcedure } from './all-integration'
import { DeleteIntegrationProcedure } from './delete-integration'

export const integrationRouter = createTRPCRouter({
	add: AddIntegrationProcedure,
	all: AllIntegrationProcedure,
	delete: DeleteIntegrationProcedure,
})
