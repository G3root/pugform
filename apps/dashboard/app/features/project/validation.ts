import { createServerValidate, formOptions } from '@tanstack/react-form/remix';
import { z } from 'zod';

export const CreateProjectFormSchema = z.object({
  name: z.string().min(1),
});

export const RenameProjectFormSchema = z.object({
  name: z.string().min(1),
  projectPublicId: z.string().min(1),
});

export const RenameProjectServerValidate = createServerValidate({
  defaultValues: {
    name: '',
    projectPublicId: '',
  },
  onServerValidate: RenameProjectFormSchema,
});

export const CreateProjectFormOptions = formOptions({
  defaultValues: {
    name: '',
  },
});

export const CreateProjectServerValidate = createServerValidate({
  ...CreateProjectFormOptions,
  onServerValidate: CreateProjectFormSchema,
});
