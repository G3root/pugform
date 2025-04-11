import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '~/components/ui/breadcrumb';

import { db } from '@pugform/database';
import { Link, data, href, useLoaderData } from 'react-router';
import { Stack } from '~/components/ui/stack.js';
import { requireAuth } from '~/features/auth/api/require-auth.server.js';
import { getForm } from '~/trpc/.server/form-router/procedures/get-form.js';
import * as Errors from '~/utils/errors';
import type { Route } from './+types/form-edit.ts';

export function loader({ request, params }: Route.LoaderArgs) {
  return requireAuth({ request })
    .andThen((session) => {
      return getForm({
        db,
        data: {
          formPublicId: params.formId,
          organizationId: session.session.activeOrganizationId,
        },
      });
    })
    .mapErr(Errors.mapRouteError)
    .match(
      (project) => {
        return {
          data: project,
        };
      },
      (error) => {
        throw data(error.errorMsg, { status: error.status });
      }
    );
}

export default function FormEditRoute() {
  const data = useLoaderData<typeof loader>();

  return (
    <Stack direction="column" gap={4}>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b">
        <div className="flex items-center gap-2 px-3">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink asChild>
                  <Link
                    to={href('/projects/:projectId', {
                      projectId: data.data.project.publicId,
                    })}
                  >
                    {data.data.project.name}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{data.data.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
    </Stack>
  );
}
