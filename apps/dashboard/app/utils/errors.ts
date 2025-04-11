export type RouteError =
  | { type: 'NotFound'; context?: string }
  | { type: 'Conflict'; context?: string }
  | { type: 'Unauthorized'; context?: string }
  | { type: 'Other'; error?: Error; context?: string }
  | { type: 'BadRequest'; context: string }
  | { type: 'MethodNotAllowed'; context?: string };

export const notFound = (context?: string): RouteError => ({
  type: 'NotFound',
  context,
});

export const conflict = (context?: string): RouteError => ({
  type: 'Conflict',
  context,
});

export const unauthorized = (context?: string): RouteError => ({
  type: 'Unauthorized',
  context,
});

export const other = (context: string, error?: Error): RouteError => ({
  type: 'Other',
  context,
  error,
});

export const badRequest = (context: string): RouteError => ({
  type: 'BadRequest',
  context,
});

export const methodNotAllowed = (context?: string): RouteError => ({
  type: 'MethodNotAllowed',
  context,
});

export const mapRouteError = (err: RouteError) => {
  // biome-ignore lint/style/useDefaultSwitchClause: <explanation>
  switch (err.type) {
    case 'BadRequest': {
      return {
        status: 400,
        errorMsg: err.context,
      };
    }

    case 'Conflict': {
      return {
        status: 409,
        errorMsg: 'Conflict',
      };
    }

    case 'Unauthorized': {
      return {
        status: 401,
        errorMsg: 'Authentication required',
      };
    }

    case 'NotFound': {
      const withMaybeContext = err.context ? ` - ${err.context}` : '';

      return {
        status: 404,
        errorMsg: `Not Found${withMaybeContext}`,
      };
    }

    case 'MethodNotAllowed': {
      return {
        status: 405,
        errorMsg: 'Method Not Allowed',
      };
    }
    case 'Other': {
      // const errorInfo = [err.error ? err.error : '', `Context: ${err.context}`]
      //   .filter((val) => val !== '')
      //   .join('\n');

      // logger.error(errorInfo)

      return {
        status: 500,
        errorMsg: 'An Internal Error Occurred :(',
      };
    }
  }
};

export function getErrorMessage(error: unknown) {
  if (typeof error === 'string') {
    return error;
  }
  if (
    error &&
    typeof error === 'object' &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return error.message;
  }
  // biome-ignore lint/suspicious/noConsole: <explanation>
  console.error('Unable to get error message for error', error);
  return 'Unknown Error';
}
