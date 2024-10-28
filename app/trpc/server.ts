import {
	createCallerFactory,
	createTRPCContext,
	type createTRPCContextOptions,
} from './init'
import { appRouter } from './routers/_register'

export const trpcServer = (option: createTRPCContextOptions) =>
	createCallerFactory(appRouter)(createTRPCContext(option))
