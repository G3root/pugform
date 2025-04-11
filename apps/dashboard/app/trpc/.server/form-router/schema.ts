import { z } from 'zod';

export const CreateFormSchema = z.object({
  name: z.string(),
  projectPublicId: z.string(),
  description: z.string().optional(),
});

export const DeleteFormSchema = z.object({
  formPublicId: z.string(),
});

export const RenameFormSchema = z.object({
  formPublicId: z.string(),
  name: z.string().min(1, 'Name is required'),
});

export const GetFormSchema = z.object({
  formPublicId: z.string(),
});
