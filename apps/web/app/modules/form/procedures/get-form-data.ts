import { jsonObjectFrom } from '@pugform/database'
import { withAuthProcedure } from '~/trpc/init'
import { getDomainUrl } from '~/utils/url'
import { GetFormSchema } from '../schema'

export const getFormDataProcedure = withAuthProcedure
	.input(GetFormSchema)
	.query(async ({ ctx, input }) => {
		const organizationId = ctx.session.organizationId

		const form = await ctx.db
			.selectFrom('form')
			.where('id', '=', input.formId)
			.where('organizationId', '=', organizationId)
			.select((eb) => [
				jsonObjectFrom(
					eb
						.selectFrom('workspace as w')
						.select(['w.publicId'])
						.whereRef('w.id', '=', 'form.workspaceId'),
				)
					.$notNull()
					.as('workspace'),
			])
			.select(['id', 'layout', 'status', 'title'])
			.executeTakeFirstOrThrow()

		const host = getDomainUrl(ctx.request)
		const shareLink = new URL(host)

		shareLink.pathname = `/${form.id}`

		return {
			data: { form: { ...form, shareLink: shareLink.toString() } },
		}
	})
