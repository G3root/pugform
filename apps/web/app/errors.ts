export type RouteError =
	| { type: 'NotFound'; context?: string }
	| { type: 'Conflict'; context?: string }
	| { type: 'Other'; error?: Error; context?: string }
	| { type: 'BadRequest'; context: string }

export const notFound = (context?: string): RouteError => ({
	type: 'NotFound',
	context,
})

export const conflict = (context?: string): RouteError => ({
	type: 'Conflict',
	context,
})

export const other = (context: string, error?: Error): RouteError => ({
	type: 'Other',
	context,
	error,
})

export const badRequest = (context: string): RouteError => ({
	type: 'BadRequest',
	context,
})

export const mapRouteError = (err: RouteError) => {
	switch (err.type) {
		case 'BadRequest': {
			return {
				status: 400,
				errorMsg: err.context,
			}
		}

		case 'Conflict': {
			return {
				status: 409,
				errorMsg: 'Conflict',
			}
		}

		case 'NotFound': {
			const withMaybeContext = err.context ? ` - ${err.context}` : ''

			return {
				status: 404,
				errorMsg: `Not Found${withMaybeContext}`,
			}
		}

		case 'Other': {
			const errorInfo = [err.error ? err.error : '', `Context: ${err.context}`]
				.filter((val) => val !== '')
				.join('\n')

			// logger.error(errorInfo)

			return {
				status: 500,
				errorMsg: 'An Internal Error Occurred :(',
			}
		}
	}
}
