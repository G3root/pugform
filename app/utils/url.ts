import { APP_DOMAIN } from '~/constants'

export function getHost(request: Request) {
	const host =
		request.headers.get('X-Forwarded-Host') ??
		request.headers.get('host') ??
		new URL(request.url).host
	return host
}

export const getSubDomain = (request: Request) => {
	const host = getHost(request).replace(
		'.localhost:3000',
		`.${APP_DOMAIN}`,
	) as string

	const hostParts = host.split('.')

	if (hostParts.length > APP_DOMAIN.split('.').length) {
		return hostParts[0]
	}

	return null
}

export function getDomainUrl(request: Request) {
	const host = getHost(request)
	const protocol = request.headers.get('X-Forwarded-Proto') ?? 'http'
	return `${protocol}://${host}`
}
