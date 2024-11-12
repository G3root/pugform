import 'dotenv/config'
import crypto from 'node:crypto'
import { db } from '@pugform/database'
import { createRequestHandler } from '@remix-run/express'
import { ip as ipAddress } from 'address'
import chalk from 'chalk'
import closeWithGrace from 'close-with-grace'
import compression from 'compression'
import express from 'express'
import { rateLimit } from 'express-rate-limit'
import getPort, { portNumbers } from 'get-port'
// import helmet from "helmet";
import morgan from 'morgan'
import { verifyRequestOrigin } from '~/utils/auth.server.js'
import {
	deleteSessionTokenCookie,
	getSessionCookie,
	setSessionTokenCookie,
	validateSessionToken,
} from '~/utils/session.server.js'

const MODE = process.env.NODE_ENV ?? 'development'
const IS_PROD = MODE === 'production'
const IS_DEV = MODE === 'development'

const viteDevServer = IS_PROD
	? undefined
	: await import('vite').then((vite) =>
			vite.createServer({
				server: { middlewareMode: true },
			}),
		)

const app = express()

/**
 * Good practices: Disable x-powered-by.
 * @see http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
 */
app.disable('x-powered-by')

app.use(compression())

/**
 * Content Security Policy.
 * Implementation based on github.com/epicweb-dev/epic-stack
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
 */
app.use((_, res, next) => {
	res.locals.cspNonce = crypto.randomBytes(16).toString('hex')
	next()
})

// app.use(
//   helmet({
//     contentSecurityPolicy: {
//       referrerPolicy: { policy: "same-origin" },
//       crossOriginEmbedderPolicy: false,
//       // ❗Important: Remove `reportOnly` to enforce CSP. (Development only).
//       reportOnly: true,
//       directives: {
//         // Controls allowed endpoints for fetch, XHR, WebSockets, etc.
//         "connect-src": [IS_DEV ? "ws:" : null, "'self'"].filter(Boolean),
//         // Defines which origins can serve fonts to your site.
//         "font-src": ["'self'"],
//         // Specifies origins allowed to be embedded as frames.
//         "frame-src": ["'self'"],
//         // Determines allowed sources for images.
//         "img-src": ["'self'", "data:"],
//         // Sets restrictions on sources for <script> elements.
//         "script-src": [
//           "'strict-dynamic'",
//           "'self'",
//           (_, res) => `'nonce-${res.locals.cspNonce}'`,
//         ],
//         // Controls allowed sources for inline JavaScript event handlers.
//         "script-src-attr": [(_, res) => `'nonce-${res.locals.cspNonce}'`],
//         // Enforces that requests are made over HTTPS.
//         "upgrade-insecure-requests": null,
//       },
//     },
//   })
// );

/**
 * Clean route paths. (No ending slashes, Better SEO)
 */
app.use((req, res, next) => {
	if (req.path.endsWith('/') && req.path.length > 1) {
		const query = req.url.slice(req.path.length)
		const safePath = req.path.slice(0, -1).replace(/\/+/g, '/')
		res.redirect(301, safePath + query)
	} else {
		next()
	}
})

// When running tests or running in development, we want to effectively disable
// rate limiting because playwright tests are very fast and we don't want to
// have to wait for the rate limit to reset between tests.
const maxMultiple =
	!IS_PROD || process.env.PLAYWRIGHT_TEST_BASE_URL ? 10_000 : 1

const rateLimitDefault = {
	windowMs: 60 * 1000,
	max: 1000 * maxMultiple,
	standardHeaders: true,
	legacyHeaders: false,
	validate: { trustProxy: false },
	// Malicious users can spoof their IP address which means we should not deault
	// to trusting req.ip when hosted on Fly.io. However, users cannot spoof Fly-Client-Ip.
	// When sitting behind a CDN such as cloudflare, replace fly-client-ip with the CDN
	// specific header such as cf-connecting-ip
	keyGenerator: (req) => {
		return req.get('cf-connecting-ip') ?? `${req.ip}`
	},
}

const strongestRateLimit = rateLimit({
	...rateLimitDefault,
	windowMs: 60 * 1000,
	max: 10 * maxMultiple,
})

const strongRateLimit = rateLimit({
	...rateLimitDefault,
	windowMs: 60 * 1000,
	max: 100 * maxMultiple,
})

const generalRateLimit = rateLimit(rateLimitDefault)

app.use((req, res, next) => {
	const STRONG_PATHS = ['/login']

	if (req.method !== 'GET' && req.method !== 'HEAD') {
		if (STRONG_PATHS.some((path) => req.path.includes(path))) {
			return strongestRateLimit(req, res, next)
		}
		return strongRateLimit(req, res, next)
	}

	return generalRateLimit(req, res, next)
})

// Handle assets requests.
if (viteDevServer) {
	app.use(viteDevServer.middlewares)
} else {
	// Remix fingerprints its assets so we can cache forever.
	app.use(
		'/assets',
		express.static('build/client/assets', { immutable: true, maxAge: '1y' }),
	)

	// Everything else (like favicon.ico) is cached for an hour. You may want to be
	// more aggressive with this caching.
	app.use(express.static('build/client', { maxAge: '1h' }))
}

app.get(['/img/*', '/favicons/*'], (req, res) => {
	// If we've gone beyond express.static for these, it means something is missing.
	// In this case, we'll simply send a 404 and skip calling other middleware.
	return res.status(404).send('Not found')
})

app.use(morgan('tiny'))

/**
 * CSRF Protection.
 * @see https://lucia-auth.com/guides/validate-session-cookies/
 */

app.use((req, res, next) => {
	if (req.method === 'GET') {
		return next()
	}
	const originHeader = req.headers.origin ?? null
	const hostHeader = req.headers.host ?? null
	if (
		!originHeader ||
		!hostHeader ||
		!verifyRequestOrigin(originHeader, [hostHeader])
	) {
		return res.status(403).end()
	}
	return next()
})

app.use(async (req, res, next) => {
	const token = getSessionCookie(req.headers.cookie ?? '')

	if (!token) {
		res.locals.user = null
		res.locals.session = null
		return next()
	}

	const { user, session } = await validateSessionToken(token, db)

	if (session !== null) {
		res.appendHeader(
			'Set-Cookie',
			setSessionTokenCookie(token, session.expiresAt),
		)
	} else {
		res.appendHeader('Set-Cookie', deleteSessionTokenCookie())
	}
	res.locals.session = session
	res.locals.user = user
	return next()
})

// Handle SSR requests.
app.all(
	'*',
	createRequestHandler({
		getLoadContext: (_, res) => ({
			cspNonce: res.locals.cspNonce,
			session: res.locals.session,
			user: res.locals.user,
		}),

		build: viteDevServer
			? () => viteDevServer.ssrLoadModule('virtual:remix/server-build')
			: // @ts-expect-error
				await import('./build/server/index.js'),
	}),
)

const desiredPort = Number(process.env.PORT || 3000)
const portToUse = await getPort({
	port: portNumbers(desiredPort, desiredPort + 100),
})
const portAvailable = desiredPort === portToUse
if (!portAvailable && !IS_DEV) {
	console.log(`⚠️ Port ${desiredPort} is not available.`)
	process.exit(1)
}

const server = app.listen(portToUse, () => {
	if (!portAvailable) {
		console.warn(
			chalk.yellow(
				`⚠️  Port ${desiredPort} is not available, using ${portToUse} instead.`,
			),
		)
	}
	console.log('🚀  We have liftoff!')
	const localUrl = `http://localhost:${portToUse}`
	let lanUrl = null
	const localIp = ipAddress() ?? 'Unknown'
	// Check if the address is a private ip
	// https://en.wikipedia.org/wiki/Private_network#Private_IPv4_address_spaces
	// https://github.com/facebook/create-react-app/blob/d960b9e38c062584ff6cfb1a70e1512509a966e7/packages/react-dev-utils/WebpackDevServerUtils.js#LL48C9-L54C10
	if (/^10[.]|^172[.](1[6-9]|2[0-9]|3[0-1])[.]|^192[.]168[.]/.test(localIp)) {
		lanUrl = `http://${localIp}:${portToUse}`
	}

	console.log(
		`
${chalk.bold('Local:')}            ${chalk.cyan(localUrl)}
${lanUrl ? `${chalk.bold('On Your Network:')}  ${chalk.cyan(lanUrl)}` : ''}
${chalk.bold('Press Ctrl+C to stop')}
		`.trim(),
	)
})

closeWithGrace(async () => {
	await new Promise((resolve, reject) => {
		server.close((e) => (e ? reject(e) : resolve('ok')))
	})
})
