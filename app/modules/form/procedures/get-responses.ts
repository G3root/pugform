import { jsonArrayFrom } from 'kysely/helpers/postgres'
import { withAuthProcedure } from '~/trpc/init'
import { GetFormResponse } from '../schema'

export const getResponsesProcedure = withAuthProcedure
	.input(GetFormResponse)
	.query(async ({ ctx, input }) => {
		const organizationId = ctx.session.organizationId

		const responses = await ctx.db
			.selectFrom('response as r')
			.where('formId', '=', input.formId)
			.where('organizationId', '=', organizationId)
			.select((eb) => [
				jsonArrayFrom(
					eb
						.selectFrom('answer as a')
						.select(['a.question', 'a.answer', 'a.type', 'a.order', 'a.id'])
						.orderBy('createdAt', 'desc')
						.whereRef('r.id', '=', 'a.responseId'),
				).as('answers'),
			])
			.select(['r.id', 'r.createdAt'])
			.orderBy('createdAt', 'desc')
			.execute()

		const labels = Array.from(
			new Set(responses.flatMap((r) => r.answers.map((a) => a.question))),
		).sort((a, b) => {
			const orderA =
				responses[0].answers.find((ans) => ans.question === a)?.order ?? 0
			const orderB =
				responses[0].answers.find((ans) => ans.question === b)?.order ?? 0
			return orderA - orderB
		})

		return {
			data: {
				labels,
				responses,
			},
		}
	})
