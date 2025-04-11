import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  data,
  useLoaderData,
} from 'react-router';
import { HoneypotProvider } from 'remix-utils/honeypot/react';
import type { Route } from './+types/root.ts';
import { GeneralErrorBoundary } from './components/error-boundary';
import { Toaster } from './components/ui/sonner';
import { useToast } from './hooks/use-toast';
import { getHints } from './utils/client-hints';
import { getEnv } from './utils/env.server';
import { pipeHeaders } from './utils/headers.server';
import { honeypot } from './utils/honeypot.server';
import { combineHeaders } from './utils/http-headers';
import { useNonce } from './utils/nonce-provider';
import type { Theme } from './utils/theme.server';
import { makeTimings } from './utils/timing.server';
import { getToast } from './utils/toast.server';
import { getDomainUrl } from './utils/url';

import '@fontsource-variable/inter';
import './app.css';

export async function loader({ request }: Route.LoaderArgs) {
  const timings = makeTimings('root loader');
  const { toast, headers: toastHeaders } = await getToast(request);
  const honeyProps = honeypot.getInputProps();
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
        toastHeaders
      ),
    }
  );
}

export const headers: Route.HeadersFunction = pipeHeaders;

function Document({
  children,
  nonce,
  theme = 'light',
  env = {},
}: {
  children: React.ReactNode;
  nonce: string;
  env?: Record<string, string | undefined>;
  theme?: Theme;
}) {
  return (
    <html className={theme} lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
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
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  // if there was an error running the loader, data could be missing
  const data = useLoaderData<typeof loader | null>();
  const nonce = useNonce();
  const theme = 'light';
  return (
    <Document nonce={nonce} theme={theme} env={data?.ENV}>
      {children}
    </Document>
  );
}

function App() {
  const data = useLoaderData<typeof loader>();
  const theme = 'light';

  useToast(data.toast);
  return (
    <>
      <Outlet />
      <Toaster theme={theme} />
    </>
  );
}

function AppWithProviders() {
  const data = useLoaderData<typeof loader>();
  return (
    <HoneypotProvider {...data.honeyProps}>
      <App />
    </HoneypotProvider>
  );
}

export default AppWithProviders;

export const ErrorBoundary = GeneralErrorBoundary;
