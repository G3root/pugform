import type { TKyselyDb } from '@pugform/database';
import { TRPCError } from '@trpc/server';
import { fromPromise } from 'neverthrow';
import * as Errors from '~/utils/errors';
import { newPublicId } from '~/utils/uuid';
import { newId } from '~/utils/uuid';
import { protectedProcedure } from '../../trpc';
import { CreateFormSchema } from '../schema';

export const createFormProcedure = protectedProcedure
  .input(CreateFormSchema)
  .mutation(async ({ ctx, input }) => {
    return createForm({
      db: ctx.db,
      data: {
        memberId: ctx.session.session.activeMemberId,
        organizationId: ctx.session.session.activeOrganizationId,
        name: input.name,
        projectPublicId: input.projectPublicId,
        description: input.description,
      },
    })
      .mapErr(Errors.mapRouteError)
      .match(
        (form) => {
          return form;
        },
        (error) => {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: error.errorMsg,
          });
        }
      );
  });

type TCreateFormOptions = {
  data: {
    name: string;
    projectPublicId: string;
    organizationId: string;
    memberId: string;
    description?: string;
  };
  db: TKyselyDb;
};
export function createForm({ data, db }: TCreateFormOptions) {
  return fromPromise(
    db
      .selectFrom('project')
      .where('publicId', '=', data.projectPublicId)
      .where('organizationId', '=', data.organizationId)
      .select('id')
      .executeTakeFirstOrThrow(),
    (e) => Errors.other('Failed to find project', e as Error)
  ).andThen((project) => {
    return fromPromise(
      db
        .insertInto('form')
        .values({
          createdAt: new Date(),
          updatedAt: new Date(),
          organizationId: data.organizationId,
          projectId: project.id,
          name: data.name,
          publicId: newPublicId(),
          creatorId: data.memberId,
          id: newId('form'),
          status: 'DRAFT',
          description: data?.description,
        })
        .returningAll()
        .executeTakeFirstOrThrow(),
      (e) => Errors.other('Failed to create form', e as Error)
    );
  });
}
