import { z } from 'zod'
import { baseProcedure } from '~/trpc/init'
import { FormIdSchema } from '../schema'

export const addSubmissionProcedure = baseProcedure
	.input(
		z.object({
			formId: FormIdSchema,
			submission: z.record(z.string()),
		}),
	)
	.query(async ({ ctx, input }) => {
		const form = ctx.db
			.selectFrom('form')
			.where('id', '=', input.formId)
			.executeTakeFirstOrThrow()
	})
