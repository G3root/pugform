import { type ResultAsync, errAsync, fromPromise, okAsync } from 'neverthrow'
import { data as responseData } from 'react-router'
import type { z } from 'zod'
import * as Errors from '~/utils/errors'

/**
 * Generic RPC handler for Remix loader or action functions
 *
 * @param request The request object from Remix
 * @param schema Zod schema for validating the request data
 * @param handler Function that processes the validated data and returns a Result
 * @param method The HTTP method to allow (GET or POST)
 * @returns Response with appropriate status code and data/error message
 */
export async function rpcHandler<T, R>(
	request: Request,
	schema: z.ZodType<T, z.ZodTypeDef, unknown>,
	handler: (data: T) => Promise<ResultAsync<R, Errors.RouteError>>,
	method: 'GET' | 'POST' = 'POST',
) {
	const parsedInput = await fromPromise(
		(async () => {
			if (request.method !== method) {
				return errAsync(Errors.methodNotAllowed())
			}

			if (method === 'POST') {
				return okAsync((await request.json()) as unknown)
			}

			const url = new URL(request.url)
			const params: Record<string, string> = {}
			url.searchParams.forEach((value, key) => {
				params[key] = value
			})
			return okAsync(params as unknown)
		})(),
		(e) =>
			Errors.other(
				'Request parsing failed',
				e instanceof Error ? e : undefined,
			),
	).andThen((data) => {
		const validationResult = schema.safeParse(data)
		if (!validationResult.success) {
			const errorMessage = validationResult.error.errors
				.map((err) => `${err.path.join('.')}: ${err.message}`)
				.join(', ')
			return errAsync(Errors.badRequest(errorMessage))
		}
		return okAsync(validationResult.data)
	})

	if (parsedInput.isErr()) {
		const error = Errors.mapRouteError(parsedInput.error)
		return responseData(
			{ status: 'failed' as const, errorMsg: error.errorMsg },
			{ status: error.status },
		)
	}

	const result = await handler(parsedInput.value)
	const final = result.mapErr(Errors.mapRouteError)

	return final.match(
		(data) =>
			responseData({ status: 'success' as const, data }, { status: 200 }),
		(error) =>
			responseData(
				{ status: 'failed' as const, errorMsg: error.errorMsg },
				{ status: error.status },
			),
	)
}

/**
 * Helper function to create a loader handler for RPC endpoints (GET)
 *
 * @param schema Zod schema for validating the request data
 * @param handler Function that processes the validated data and returns a Result
 * @returns A function that can be used as a Remix loader
 */
export function createRpcQueryHandler<T, R>(
	schema: z.ZodType<T, z.ZodTypeDef, unknown>,
	handler: (data: T) => Promise<ResultAsync<R, Errors.RouteError>>,
) {
	return async ({ request }: { request: Request }) =>
		rpcHandler(request, schema, handler, 'GET')
}

/**
 * Helper function to create an action handler for RPC endpoints (POST)
 *
 * @param schema Zod schema for validating the request data
 * @param handler Function that processes the validated data and returns a Result
 * @returns A function that can be used as a Remix action
 */
export function createRpcMutationHandler<T, R>(
	schema: z.ZodType<T, z.ZodTypeDef, unknown>,
	handler: (data: T) => Promise<ResultAsync<R, Errors.RouteError>>,
) {
	return async ({ request }: { request: Request }) =>
		rpcHandler(request, schema, handler, 'POST')
}
