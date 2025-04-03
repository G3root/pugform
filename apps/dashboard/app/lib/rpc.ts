import { type ResultAsync, errAsync, okAsync } from 'neverthrow'
import { data as responseData } from 'react-router'
import type { z } from 'zod'
import {
	type RouteError,
	badRequest,
	mapRouteError,
	other,
} from '~/utils/errors'

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
	handler: (data: T) => Promise<ResultAsync<R, RouteError>>,
	method: 'GET' | 'POST' = 'POST',
) {
	// Only allow the specified method
	if (request.method !== method) {
		return responseData(
			{
				error: `Method not allowed. Use ${method} for this endpoint.`,
			},
			{
				status: 405,
			},
		)
	}

	try {
		let data: unknown

		// Parse the request data based on the method
		if (method === 'POST') {
			// For POST requests, parse the request body
			data = await request.json()
		} else {
			// For GET requests, parse the URL search params
			const url = new URL(request.url)
			const params: Record<string, string> = {}

			// Convert URLSearchParams to a plain object
			url.searchParams.forEach((value, key) => {
				params[key] = value
			})

			data = params
		}

		// Validate the request data against the schema
		const validationResult = schema.safeParse(data)

		if (!validationResult.success) {
			// If validation fails, return a bad request error
			const errorMessage = validationResult.error.errors
				.map((err) => `${err.path.join('.')}: ${err.message}`)
				.join(', ')

			return responseData(
				{
					error: errorMessage,
				},
				{
					status: 400,
				},
			)
		}

		// Process the validated data
		const result = await handler(validationResult.data)

		// Handle the result
		return result.match(
			(data) => responseData({ data }),
			(error) => {
				const { status, errorMsg } = mapRouteError(error)
				return responseData({ error: errorMsg }, { status })
			},
		)
	} catch (e) {
		// Handle unexpected errors
		const error = other(
			'Unexpected error during RPC processing',
			e instanceof Error ? e : undefined,
		)
		const { status, errorMsg } = mapRouteError(error)
		return responseData({ error: errorMsg }, { status })
	}
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
	handler: (data: T) => Promise<ResultAsync<R, RouteError>>,
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
	handler: (data: T) => Promise<ResultAsync<R, RouteError>>,
) {
	return async ({ request }: { request: Request }) =>
		rpcHandler(request, schema, handler, 'POST')
}
