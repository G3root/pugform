import { z } from 'zod'

export const CreateWorkspaceSchema = z.object({
	name: z.string().max(70),
})

export const DeleteWorkspaceSchema = z.object({
	id: z.string().max(30),
})

export const workspacePublicIdLength = 6

export const WorkspaceByPublicIdSchema = z.object({
	publicId: z
		.string()
		.max(workspacePublicIdLength)
		.min(workspacePublicIdLength),
})
