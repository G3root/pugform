import { createTRPCRouter } from '~/trpc/init'
import { AddIntegrationProcedure } from './add-integration'

export const integrationRouter = createTRPCRouter({
	add: AddIntegrationProcedure,
})
