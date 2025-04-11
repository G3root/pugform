import type { TKyselyDb } from '@pugform/database';
import { fromPromise, okAsync } from 'neverthrow';
import { z } from 'zod';
import * as Errors from '~/utils/errors';
import { protectedProcedure } from '../../trpc';

export const renameProjectProcedure = protectedProcedure
  .input(
    z.object({
      projectPublicId: z.string(),
      name: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    return renameProject({
      db: ctx.db,
      data: {
        ...input,
        organizationId: ctx.session.session.activeOrganizationId,
      },
    });
  });

interface RenameProjectOptions {
  db: TKyselyDb;
  data: {
    projectPublicId: string;
    name: string;
    organizationId: string;
  };
}

export function renameProject({ db, data }: RenameProjectOptions) {
  return fromPromise(
    db
      .updateTable('project')
      .set({ name: data.name, updatedAt: new Date() })
      .where('publicId', '=', data.projectPublicId)
      .where('organizationId', '=', data.organizationId)
      .executeTakeFirst(),
    (e) => Errors.other('failed to rename project', e as Error)
  ).andThen(() => {
    return okAsync({
      success: true,
    });
  });
}
