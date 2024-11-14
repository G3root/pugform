import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router'
import {
	Form,
	Link,
	data,
	redirect,
	useActionData,
	useSearchParams,
} from 'react-router'
import type { AppLoadContext } from 'react-router'
import { HoneypotInputs } from 'remix-utils/honeypot/react'
import { z } from 'zod'
import { ErrorList } from '~/components/error-list'
import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { Checkbox } from '~/components/ui/checkbox'
import { Stack } from '~/components/ui/stack'
import { TextField } from '~/components/ui/text-field'
import {
	checkEmailAvailability,
	requireAnonymous,
	signUp,
} from '~/utils/auth.server'
import { checkHoneypot } from '~/utils/honeypot.server'
import { setSessionTokenCookie } from '~/utils/session.server'
import {
	NameSchema,
	PasswordAndConfirmPasswordSchema,
} from '~/utils/user-validation'
import {
	type TVerificationType,
	verifySessionStorage,
} from '~/utils/verification.server'

const SignupFormSchema = z
	.object({
		name: NameSchema,
		agreeToTermsOfServiceAndPrivacyPolicy: z.boolean({
			required_error:
				'You must agree to the terms of service and privacy policy',
		}),
		remember: z.boolean().optional(),
		redirectTo: z.string().optional(),
	})
	.and(PasswordAndConfirmPasswordSchema)

const type: TVerificationType = 'onboarding' as const

const Schema = z.object({
	target: z.string(),
	type: z.literal(type),
})

async function requireOnboardingEmail({
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

export async function loader({ request, context }: LoaderFunctionArgs) {
	const { target } = await requireOnboardingEmail({ context, request })
	return { email: target }
}

export async function action({ request, context }: ActionFunctionArgs) {
	const { target: email } = await requireOnboardingEmail({ context, request })
	const formData = await request.formData()
	checkHoneypot(formData)

	const submission = await parseWithZod(formData, {
		schema: (intent) =>
			SignupFormSchema.superRefine(async (data, ctx) => {
				const existingUser = await checkEmailAvailability(email)
				if (existingUser) {
					ctx.addIssue({
						path: ['email'],
						code: z.ZodIssueCode.custom,
						message: 'A user already exists with this email',
					})
					return
				}
			}).transform(async (data) => {
				if (intent !== null) return { ...data, session: null }

				const session = await signUp({ ...data, email })
				return { ...data, session }
			}),
		async: true,
	})
	if (submission.status !== 'success' || !submission.value.session) {
		return data(
			{ result: submission.reply() },
			{ status: submission.status === 'error' ? 400 : 200 },
		)
	}

	const { session } = submission.value

	redirect('/dashboard', {
		headers: {
			'Set-Cookie': setSessionTokenCookie(
				session.sessionToken,
				session.expiresAt,
			),
		},
	})
}

export default function OnboardingPage() {
	const actionData = useActionData<typeof action>()
	const [searchParams] = useSearchParams()
	const redirectTo = searchParams.get('redirectTo')

	const [form, fields] = useForm({
		id: 'signup-form',
		constraint: getZodConstraint(SignupFormSchema),
		lastResult: actionData?.result,
		onValidate({ formData }) {
			const result = parseWithZod(formData, { schema: SignupFormSchema })
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
						<Card.Title>Onboarding</Card.Title>
						<Card.Description>
							Enter your information to create an account
						</Card.Description>
					</Card.Header>
					<Card.Content>
						<Stack>
							<ErrorList errors={form.errors} id={form.errorId} />
							<HoneypotInputs />

							<TextField
								label="Name"
								{...getInputProps(fields.name, { type: 'text' })}
								errors={fields.name.errors}
							/>

							<TextField
								label="Password"
								isRevealable
								{...getInputProps(fields.password, { type: 'password' })}
								errors={fields.password.errors}
							/>

							<TextField
								label="Confirm Password"
								isRevealable
								{...getInputProps(fields.confirmPassword, { type: 'password' })}
								errors={fields.confirmPassword.errors}
							/>
							<Checkbox
								{...getInputProps(
									fields.agreeToTermsOfServiceAndPrivacyPolicy,
									{ type: 'checkbox' },
								)}
								label="Do you agree to our Terms of Service and Privacy Policy?"
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
