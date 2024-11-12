import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { data, redirect } from '@remix-run/node'
import type { AppLoadContext } from '@remix-run/node'
import { Form, useActionData, useSearchParams } from '@remix-run/react'
import { HoneypotInputs } from 'remix-utils/honeypot/react'
import { z } from 'zod'
import { ErrorList } from '~/components/error-list'
import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { InputOTP } from '~/components/ui/input-otp'
import { requireAnonymous } from '~/utils/auth.server'
import { checkHoneypot } from '~/utils/honeypot.server'
import {
	type TVerificationType,
	isCodeValid,
	verifySessionStorage,
} from '~/utils/verification.server'

const type: TVerificationType = 'email-verification' as const

const Schema = z.object({
	target: z.string(),
	type: z.literal(type),
})

async function requireVerificationEmail({
	context,
	request,
}: { context: AppLoadContext; request: Request }) {
	requireAnonymous(context)
	const verifySession = await verifySessionStorage.getSession(
		request.headers.get('cookie'),
	)
	const target = verifySession.get('target')
	const type = verifySession.get('type')

	const verified = Schema.safeParse({ target, type })

	if (!verified.success) {
		throw redirect('/dashboard/sign-up')
	}

	return { ...verified.data, verifySession }
}

export async function loader({ context, request }: LoaderFunctionArgs) {
	const verificationId = await requireVerificationEmail({ context, request })

	return {}
}

export async function action({ request, context }: ActionFunctionArgs) {
	const { target, type, verifySession } = await requireVerificationEmail({
		context,
		request,
	})

	const formData = await request.formData()
	checkHoneypot(formData)

	const submission = await parseWithZod(formData, {
		schema: (intent) =>
			VerifySchema.transform(async (data, ctx) => {
				const otpResults = await isCodeValid({ ...data, target, type })

				if (otpResults === 'invalid') {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Invalid otp',
					})
					return z.NEVER
				}

				return { ...data, result: otpResults }
			}),
		async: true,
	})

	if (
		submission.status !== 'success' ||
		submission.value.result === 'expired'
	) {
		return data(
			{ result: submission.reply() },
			{ status: submission.status === 'error' ? 400 : 200 },
		)
	}

	verifySession.set('type', 'onboarding')

	return redirect('/dashboard/onboarding', {
		headers: {
			'set-cookie': await verifySessionStorage.commitSession(verifySession),
		},
	})
}

const VerifySchema = z.object({
	code: z.string().min(6).max(6),
})

export default function VerifyEmail() {
	const [searchParams] = useSearchParams()

	const actionData = useActionData<typeof action>()
	const [form, fields] = useForm({
		id: 'verify-email-form',
		constraint: getZodConstraint(VerifySchema),
		lastResult: actionData?.result,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: VerifySchema })
		},
		defaultValue: {
			code: searchParams.get('code'),
		},
	})

	return (
		<Form
			method="POST"
			{...getFormProps(form)}
			className="flex items-center justify-center min-h-screen"
		>
			<Card>
				<Card.Header>
					<Card.Title>Verify Your Email</Card.Title>
					<Card.Description>
						We've sent you a code to verify your email address.
					</Card.Description>
				</Card.Header>
				<Card.Content className="space-y-6">
					<ErrorList errors={form.errors} id={form.errorId} />
					<HoneypotInputs />

					<InputOTP
						maxLength={6}
						{...getInputProps(fields.code, { type: 'text' })}
					>
						<InputOTP.Group>
							{[...Array(6)].map((_, index) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								<InputOTP.Slot key={index} index={index} />
							))}
						</InputOTP.Group>
					</InputOTP>
				</Card.Content>
				<Card.Footer>
					<Button type="submit">Submit</Button>
				</Card.Footer>
			</Card>
		</Form>
	)
}
