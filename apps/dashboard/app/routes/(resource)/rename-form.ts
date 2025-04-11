import { db } from '@pugform/database';
import { ServerValidateError } from '@tanstack/react-form/remix';
import { fromPromise } from 'neverthrow';
import { requireAuth } from '~/features/auth/api/require-auth.server';
import { RenameFormServerValidate } from '~/features/form/validation';
import { renameForm } from '~/trpc/.server/form-router/procedures/rename-form';
import * as Errors from '~/utils/errors';
import type { Route } from './+types/rename-form.ts';

export async function action({ request }: Route.ActionArgs) {
  return requireAuth({ request })
    .andThen((session) => {
      return fromPromise(request.formData(), (e) =>
        Errors.badRequest('failed to parse form data')
      ).andThen((formData) => {
        return fromPromise(
          RenameFormServerValidate(formData),
          (e) => e
        ).andThen((form) => {
          return renameForm({
            db,
            data: {
              ...form,
              organizationId: session.session.activeOrganizationId,
            },
          });
        });
      });
    })
    .match(
      () => {
        return null;
      },
      (error) => {
        if (error instanceof ServerValidateError) {
          return error.formState;
        }
        const mapped = Errors.mapRouteError(error as Errors.RouteError);
        return mapped.errorMsg;
      }
    );
}
