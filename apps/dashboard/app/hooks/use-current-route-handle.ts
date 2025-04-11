import { useMatches } from 'react-router';

export function useCurrentRouteHandle<T>() {
  const matches = useMatches();

  // Find the current route's match (the last one in the array is usually the current route)
  const currentMatch = matches[matches.length - 1];

  // Return the handle, or undefined if not present
  return currentMatch?.handle as T;
}
