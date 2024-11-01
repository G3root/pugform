import { z } from 'zod'
import {
	WORKSPACE_PUBLIC_ID_MAX_LENGTH,
	WORKSPACE_PUBLIC_ID_MIN_LENGTH,
} from './constants'

export const CreateWorkspaceSchema = z.object({
	name: z.string().max(70),
})

export const DeleteWorkspaceSchema = z.object({
	id: z.string().max(30),
})

export const WorkspacePublicIdSchema = z
	.string()
	.max(WORKSPACE_PUBLIC_ID_MAX_LENGTH)
	.min(WORKSPACE_PUBLIC_ID_MIN_LENGTH)

export const WorkspaceByPublicIdSchema = z.object({
	publicId: WorkspacePublicIdSchema,
})
