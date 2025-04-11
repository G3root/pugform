import { type ResultAsync, errAsync, fromPromise, okAsync } from 'neverthrow';
import { data as responseData } from 'react-router';
import type { z } from 'zod';
import * as Errors from '~/utils/errors';

// type AuthenticatedContext = Omit<TBaseContext, 'session'> & {
// 	session: NonNullable<TBaseContext['session']> & {
// 		user: NonNullable<TBaseContext['session']>['user']
// 	}
// }

type RpcHandlerConfig<T, R, Ctx> = {
  schema: z.ZodType<T, z.ZodTypeDef, unknown>;
  handler: (data: T, ctx: Ctx) => Promise<ResultAsync<R, Errors.RouteError>>;
  request: Request;
  createContext: (request: Request) => Promise<Ctx>;
  method: 'GET' | 'POST';
};

/**
 * Generic RPC handler for Remix loader or action functions
 *
 * @param request The request object from Remix
 * @param schema Zod schema for validating the request data
 * @param handler Function that processes the validated data and returns a Result
 * @param method The HTTP method to allow (GET or POST)
 * @returns Response with appropriate status code and data/error message
 */
export async function rpcHandler<T, R, Ctx>({
  schema,
  handler,
  request,
  createContext,
  method,
}: RpcHandlerConfig<T, R, Ctx>) {
  const parsedInput = await fromPromise(
    (async () => {
      if (request.method !== method) {
        return errAsync(Errors.methodNotAllowed());
      }

      if (method === 'POST') {
        return await request.json();
      }

      const url = new URL(request.url);
      const params: Record<string, string> = {};
      url.searchParams.forEach((value, key) => {
        params[key] = value;
      });
      return params as unknown;
    })(),
    (e) =>
      Errors.other('Request parsing failed', e instanceof Error ? e : undefined)
  ).andThen((data) => {
    const validationResult = schema.safeParse(data);

    if (!validationResult.success) {
      const errorMessage = validationResult.error.errors
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join(', ');

      return errAsync(Errors.badRequest(errorMessage));
    }
    return okAsync(validationResult.data);
  });

  if (parsedInput.isErr()) {
    const error = Errors.mapRouteError(parsedInput.error);
    return responseData(
      { status: 'failed' as const, errorMsg: error.errorMsg },
      error.status
    );
  }

  const ctx = await createContext(request);
  const result = await handler(parsedInput.value, ctx);
  const final = result.mapErr(Errors.mapRouteError);

  return final.match(
    (data) => responseData({ status: 'success' as const, data }, 200),
    (error) => {
      console.log('errors', error);
      return responseData(
        { status: 'failed' as const, errorMsg: error.errorMsg },
        error.status
      );
    }
  );
}

// /**
//  * Creates a protected query handler that requires authentication
//  */
// export function createProtectedQueryHandler<T, R>(
// 	config: ProtectedHandlerConfig<T, R>,
// ) {
// 	return async ({ request }: { request: Request }) => {
// 		return rpcHandler({
// 			...config,
// 			request,
// 			method: 'GET',
// 			createContext: async (req) => {
// 				const ctx = await createBaseContext(req)
// 				if (!ctx.session?.user) {
// 					throw Errors.unauthorized('Authentication required')
// 				}

// 				return {
// 					...ctx,
// 					session: {
// 						...ctx.session,
// 						user: ctx.session.user,
// 					},
// 				} as AuthenticatedContext
// 			},
// 		})
// 	}
// }

// /**
//  * Creates a protected mutation handler that requires authentication
//  */
// export function createProtectedMutationHandler<T, R>(
// 	config: ProtectedHandlerConfig<T, R>,
// ) {
// 	return async ({ request }: { request: Request }) => {
// 		return rpcHandler({
// 			...config,
// 			request,
// 			method: 'POST',
// 			createContext: async (req) => {
// 				const ctx = await createBaseContext(req)
// 				if (!ctx.session?.user) {
// 					throw Errors.unauthorized('Authentication required')
// 				}

// 				return {
// 					...ctx,
// 					session: {
// 						...ctx.session,
// 						user: ctx.session.user,
// 					},
// 				} as AuthenticatedContext
// 			},
// 		})
// 	}
// }
