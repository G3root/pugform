import { createServerValidate, formOptions } from '@tanstack/react-form/remix';
import { z } from 'zod';

export const CreateFormFormSchema = z.object({
  name: z.string().min(1),
  projectPublicId: z.string().min(1),
  description: z.string(),
});

export const CreateFormFormOptions = formOptions({
  defaultValues: {
    name: '',
    projectPublicId: '',
    description: '',
  },
});

export const CreateFormFormServerValidate = createServerValidate({
  ...CreateFormFormOptions,
  onServerValidate: CreateFormFormSchema,
});

export const RenameFormFormSchema = z.object({
  name: z.string().min(1),
  formPublicId: z.string().min(1),
});

export const RenameFormFormOptions = formOptions({
  defaultValues: {
    name: '',
    formPublicId: '',
  },
});

export const RenameFormServerValidate = createServerValidate({
  ...RenameFormFormOptions,
  onServerValidate: RenameFormFormSchema,
});
