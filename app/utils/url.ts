export function getHost(request: Request) {
	const host =
		request.headers.get('X-Forwarded-Host') ??
		request.headers.get('host') ??
		new URL(request.url).host
	return host
}

// export const getSubDomain = (request: Request) => {
// 	const appDomain = process.env.PUBLIC_APP_DOMAIN
// 	const host = getHost(request).replace(
// 		'.localhost:3000',
// 		`.${appDomain}`,
// 	) as string

// 	const hostParts = host.split('.')

// 	if (hostParts.length > appDomain.split('.').length) {
// 		return hostParts[0]
// 	}

// 	return null
// }

export function getDomainUrl(request: Request) {
	const host = getHost(request)
	const protocol = request.headers.get('X-Forwarded-Proto') ?? 'http'
	return `${protocol}://${host}`
}
