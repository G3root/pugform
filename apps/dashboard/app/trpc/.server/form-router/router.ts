import { router } from '../trpc';
import { createFormProcedure } from './procedures/create-form';
import { deleteFormProcedure } from './procedures/delete-form';
import { getFormProcedure } from './procedures/get-form';
import { renameFormProcedure } from './procedures/rename-form';

export const formRouter = router({
  createForm: createFormProcedure,
  deleteForm: deleteFormProcedure,
  renameForm: renameFormProcedure,
  getForm: getFormProcedure,
});
