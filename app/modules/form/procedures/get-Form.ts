import { z } from 'zod'
import { withAuthProcedure } from '~/trpc/init'
import { GetFormSchema } from '../schema'

export const getFormProcedure = withAuthProcedure
	.input(GetFormSchema)
	.query(async ({ ctx, input }) => {
		const organizationId = ctx.session.organizationId
		const membershipId = ctx.session.membershipId

		const form = await ctx.db
			.selectFrom('form')
			.where('id', '=', input.formId)
			.where('organizationId', '=', organizationId)
			.select(['id', 'layout', 'status', 'title'])
			.executeTakeFirstOrThrow()

		const pages = await ctx.db
			.selectFrom('formPage')
			.where('organizationId', '=', organizationId)
			.where('formId', '=', form.id)
			.selectAll()
			.execute()

		return {}
	})
