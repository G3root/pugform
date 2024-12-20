import { RouterProvider } from 'react-aria-components'
import { type LoaderFunctionArgs, data } from 'react-router'
import type { HeadersFunction } from 'react-router'
import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useHref,
	useLoaderData,
	useNavigate,
} from 'react-router'
import { HoneypotProvider } from 'remix-utils/honeypot/react'
import { GeneralErrorBoundary } from './components/error-boundary'
import { Toast } from './components/ui/toast'
import { useToast } from './hooks/use-toast'
import { ClientHintCheck, getHints } from './utils/client-hints'
import { getEnv } from './utils/env.server'
import { honeypot } from './utils/honeypot.server'
import { combineHeaders } from './utils/http-headers'
import { useNonce } from './utils/nonce-provider'
import type { Theme } from './utils/theme.server'
import { makeTimings } from './utils/timing.server'
import { getToast } from './utils/toast.server'
import { getDomainUrl } from './utils/url'

import '@fontsource-variable/inter'
import './tailwind.css'

export async function loader({ request }: LoaderFunctionArgs) {
	const timings = makeTimings('root loader')
	const { toast, headers: toastHeaders } = await getToast(request)
	const honeyProps = honeypot.getInputProps()
	return data(
		{
			requestInfo: {
				hints: getHints(request),
				origin: getDomainUrl(request),
				path: new URL(request.url).pathname,
				userPrefs: {
					// theme: getTheme(request),
					theme: 'light',
				},
			},
			ENV: getEnv(),
			toast,
			honeyProps,
		},
		{
			headers: combineHeaders(
				{ 'Server-Timing': timings.toString() },
				toastHeaders,
			),
		},
	)
}

export const headers: HeadersFunction = ({ loaderHeaders }) => {
	const headers = {
		'Server-Timing': loaderHeaders.get('Server-Timing') ?? '',
	}
	return headers
}

interface DocumentProps {
	children: React.ReactNode
	nonce: string
	theme?: Theme
	env?: Record<string, string>
}

function Document({
	children,
	nonce,
	theme = 'light',
	env = {},
}: DocumentProps) {
	const navigate = useNavigate()
	return (
		<html lang="en" className={`${theme}`}>
			<head>
				<ClientHintCheck nonce={nonce} />
				<Meta />
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width,initial-scale=1" />

				<Links />
			</head>
			<body className="min-h-screen">
				<RouterProvider navigate={navigate} useHref={useHref}>
					{children}
				</RouterProvider>
				<script
					nonce={nonce}
					// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
					dangerouslySetInnerHTML={{
						__html: `window.ENV = ${JSON.stringify(env)}`,
					}}
				/>
				<ScrollRestoration nonce={nonce} />
				<Scripts nonce={nonce} />
			</body>
		</html>
	)
}

function App() {
	const data = useLoaderData<typeof loader>()
	const nonce = useNonce()
	const theme = 'light'

	useToast(data.toast)

	return (
		<Document nonce={nonce} theme={theme} env={data.ENV}>
			<Outlet />
			<Toast closeButton position="top-center" theme={theme} />
		</Document>
	)
}

export default function AppWithProviders() {
	const data = useLoaderData<typeof loader>()
	return (
		<HoneypotProvider {...data.honeyProps}>
			<App />
		</HoneypotProvider>
	)
}
// this is a last resort error boundary. There's not much useful information we
// can offer at this level.
export const ErrorBoundary = GeneralErrorBoundary
