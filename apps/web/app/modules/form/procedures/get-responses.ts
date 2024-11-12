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
						.whereRef('r.id', '=', 'a.responseId'),
				).as('answers'),
			])
			.select(['r.id', 'r.createdAt'])
			.orderBy('createdAt', 'desc')
			.execute()

		const labels = Array.from(
			new Set(responses.flatMap((r) => r.answers.map((a) => a.question))),
		)

		const structuredResponses = responses.map((response) => {
			const orderedAnswers = labels.map((question, index) => {
				const answerObj = response.answers.find((a) => a.question === question)
				return answerObj
					? { id: answerObj.id, answer: answerObj.answer, type: answerObj.type }
					: { id: `placeholder-${index}`, answer: null, type: null } // Placeholder for missing answers
			})

			return {
				id: response.id,
				answers: orderedAnswers,
				createdAt: response.createdAt,
			}
		})

		return {
			data: {
				labels,
				responses: structuredResponses,
			},
		}
	})
