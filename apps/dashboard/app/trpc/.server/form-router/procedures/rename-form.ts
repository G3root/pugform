import type { TKyselyDb } from '@pugform/database';
import { TRPCError } from '@trpc/server';
import { fromPromise } from 'neverthrow';
import * as Errors from '~/utils/errors';
import { protectedProcedure } from '../../trpc';
import { RenameFormSchema } from '../schema';

export const renameFormProcedure = protectedProcedure
  .input(RenameFormSchema)
  .mutation(async ({ ctx, input }) => {
    return renameForm({
      db: ctx.db,
      data: {
        formPublicId: input.formPublicId,
        organizationId: ctx.session.session.activeOrganizationId,
        name: input.name,
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

type TRenameFormOptions = {
  data: {
    formPublicId: string;
    organizationId: string;
    name: string;
  };
  db: TKyselyDb;
};
export function renameForm({ data, db }: TRenameFormOptions) {
  return fromPromise(
    db
      .updateTable('form')
      .set({
        name: data.name,
        updatedAt: new Date(),
      })
      .where('publicId', '=', data.formPublicId)
      .where('organizationId', '=', data.organizationId)
      .executeTakeFirstOrThrow(),
    (e) => Errors.other('Failed to rename form', e as Error)
  );
}
