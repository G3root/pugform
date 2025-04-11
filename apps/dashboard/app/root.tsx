import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';
import type { Route } from './+types/root.ts';
import { GeneralErrorBoundary } from './components/error-boundary';
import { Toaster } from './components/ui/sonner';

import '@fontsource-variable/inter';
import './app.css';

export async function loader({ request }: Route.LoaderArgs) {
  return {};
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <>
      <Toaster />
      <Outlet />
    </>
  );
}

export const ErrorBoundary = GeneralErrorBoundary;
