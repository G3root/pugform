import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { createContext } from '~/trpc/.server/context';
import { appRouter } from '~/trpc/.server/router';
import type { Route } from './+types/trpc.ts';

const handleRequest = (args: Route.LoaderArgs | Route.ActionArgs) => {
  return fetchRequestHandler({
    endpoint: '/trpc',
    req: args.request,
    router: appRouter,
    createContext,
  });
};

export const loader = (args: Route.LoaderArgs) => handleRequest(args);

export const action = (args: Route.ActionArgs) => handleRequest(args);
