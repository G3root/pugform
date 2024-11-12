import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import {
	Form,
	Link,
	data,
	redirect,
	useActionData,
	useSearchParams,
} from '@remix-run/react'
import { HoneypotInputs } from 'remix-utils/honeypot/react'
import { z } from 'zod'
import { ErrorList } from '~/components/error-list'
import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { Stack } from '~/components/ui/stack'
import { TextField } from '~/components/ui/text-field'
import { db } from '~/lib/db.server'
import { checkEmailAvailability, requireAnonymous } from '~/utils/auth.server'
import { checkHoneypot } from '~/utils/honeypot.server'
import { EmailSchema } from '~/utils/user-validation'
import {
	type TVerificationType,
	prepareVerification,
	verifySessionStorage,
} from '~/utils/verification.server'

const SignUpSchema = z.object({
	email: EmailSchema,
})

export async function loader({ request, context }: LoaderFunctionArgs) {
	requireAnonymous(context)
	return {}
}

export async function action({ request, context }: ActionFunctionArgs) {
	requireAnonymous(context)
	const formData = await request.formData()
	checkHoneypot(formData)

	const submission = await parseWithZod(formData, {
		schema: SignUpSchema.superRefine(async (data, ctx) => {
			const existingUser = await checkEmailAvailability(data.email)
			if (existingUser) {
				ctx.addIssue({
					path: ['email'],
					code: z.ZodIssueCode.custom,
					message: 'A user already exists with this email',
				})
				return
			}
		}),
		async: true,
	})
	if (submission.status !== 'success') {
		return data(
			{ result: submission.reply() },
			{ status: submission.status === 'error' ? 400 : 200 },
		)
	}

	const { email } = submission.value

	const target = email
	const type: TVerificationType = 'email-verification'

	const verificationRequest = await db.transaction().execute((trx) => {
		return prepareVerification(
			{
				request,
				target: email,
				type,
				verifyUrlPath: '/dashboard/verify-email',
			},
			trx,
		)
	})

	sendVerificationEmail(email, verificationRequest.otp)

	const session = await verifySessionStorage.getSession(
		request.headers.get('Cookie'),
	)

	session.set('target', target)
	session.set('type', type)

	return redirect(verificationRequest.redirectTo.toString(), {
		headers: {
			'Set-Cookie': await verifySessionStorage.commitSession(session),
		},
	})
}

function sendVerificationEmail(email: string, code: string): void {
	console.log(`To ${email}: Your verification code is ${code}`)
}

export default function SignUp() {
	const actionData = useActionData<typeof action>()
	const [searchParams] = useSearchParams()
	const redirectTo = searchParams.get('redirectTo')

	const [form, fields] = useForm({
		id: 'signup-form',
		constraint: getZodConstraint(SignUpSchema),
		lastResult: actionData?.result,
		onValidate({ formData }) {
			const result = parseWithZod(formData, { schema: SignUpSchema })
			return result
		},
		shouldRevalidate: 'onBlur',
	})

	return (
		<div className="flex min-h-screen flex-col items-center pt-16 sm:justify-center sm:pt-0">
			<Form
				className="relative mt-6 w-full max-w-lg"
				method="POST"
				{...getFormProps(form)}
			>
				<Card>
					<Card.Header>
						<Card.Title>Sign Up</Card.Title>
						<Card.Description>
							Enter your email to create an account
						</Card.Description>
					</Card.Header>
					<Card.Content>
						<Stack>
							<ErrorList errors={form.errors} id={form.errorId} />
							<HoneypotInputs />
							<TextField
								label="Email"
								{...getInputProps(fields.email, { type: 'email' })}
								errors={fields.email.errors}
							/>
						</Stack>
					</Card.Content>
					<Card.Footer>
						<Stack
							fullWidth
							direction="row"
							align="center"
							justify="between"
							gap={3}
						>
							<Link className="text-sm text-fg underline" to="/dashboard/login">
								already have an account?
							</Link>
							<Button type="submit">Create an account</Button>
						</Stack>
					</Card.Footer>
				</Card>
			</Form>
		</div>
	)
}
