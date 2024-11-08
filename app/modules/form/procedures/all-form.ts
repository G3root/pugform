import { withAuthProcedure } from '~/trpc/init'

export const allFormProcedure = withAuthProcedure.query(async ({ ctx }) => {
	const forms = await ctx.db
		.selectFrom('form')
		.where('organizationId', '=', ctx.session.id)
		.select(['id', 'title'])
		.execute()

	return { data: forms }
})
