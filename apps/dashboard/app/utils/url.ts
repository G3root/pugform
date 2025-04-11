export function getHost(request: Request) {
  const host =
    request.headers.get('X-Forwarded-Host') ??
    request.headers.get('host') ??
    new URL(request.url).host;
  return host;
}

export function getDomainUrl(request: Request) {
  const host = getHost(request);
  const protocol = request.headers.get('X-Forwarded-Proto') ?? 'http';
  return `${protocol}://${host}`;
}
