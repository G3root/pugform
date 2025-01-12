import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { data, redirect } from 'react-router'
import { Form, Link, useSearchParams } from 'react-router'
import { HoneypotInputs } from 'remix-utils/honeypot/react'
import { z } from 'zod'
import { ErrorList } from '~/components/error-list'
import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { Checkbox } from '~/components/ui/checkbox'
import { Stack } from '~/components/ui/stack'
import { TextField } from '~/components/ui/text-field'
import { login, requireAnonymous } from '~/utils/auth.server'
import { checkHoneypot } from '~/utils/honeypot.server'
import { setSessionTokenCookie } from '~/utils/session.server'
import { EmailSchema, PasswordSchema } from '~/utils/user-validation'
import type { Route } from './+types/login'

const LoginFormSchema = z.object({
	email: EmailSchema,
	password: PasswordSchema,
	redirectTo: z.string().optional(),
	remember: z.boolean().optional(),
})

export async function loader({ request, context }: Route.LoaderArgs) {
	requireAnonymous(context)

	const isDev = process.env.NODE_ENV === 'development'
	return {
		defaultValues: {
			email: isDev ? 'user1@example.com' : undefined,
			password: isDev ? 'P@ssw0rd!' : undefined,
		},
	}
}

export async function action({ request, context }: Route.ActionArgs) {
	requireAnonymous(context)
	const formData = await request.formData()
	checkHoneypot(formData)

	const submission = await parseWithZod(formData, {
		schema: (intent) =>
			LoginFormSchema.transform(async (data, ctx) => {
				if (intent !== null) return { ...data, session: null }

				const session = await login(data)

				if (!session) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Invalid username or password',
					})
					return z.NEVER
				}

				return { ...data, session }
			}),
		async: true,
	})

	if (submission.status !== 'success' || !submission.value.session) {
		return data(
			{ result: submission.reply({ hideFields: ['password'] }) },
			{ status: submission.status === 'error' ? 400 : 200 },
		)
	}

	const { session } = submission.value

	return redirect('/', {
		headers: {
			'Set-Cookie': setSessionTokenCookie(
				session.sessionToken,
				session.expiresAt,
			),
		},
	})
}

export default function Login({
	loaderData,
	actionData,
}: Route.ComponentProps) {
	const [searchParams] = useSearchParams()
	const redirectTo = searchParams.get('redirectTo')

	const [form, fields] = useForm({
		id: 'login-form',
		constraint: getZodConstraint(LoginFormSchema),
		defaultValue: { redirectTo, ...loaderData.defaultValues },
		lastResult: actionData?.result,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: LoginFormSchema })
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
						<Card.Title>Login</Card.Title>
						<Card.Description>
							Welcome back, please enter your credentials to continue.
						</Card.Description>
					</Card.Header>
					<Card.Content className="space-y-6">
						<ErrorList errors={form.errors} id={form.errorId} />
						<HoneypotInputs />
						<TextField
							label="Email"
							placeholder="Enter your email"
							{...getInputProps(fields.email, { type: 'email' })}
							errors={fields.email.errors}
						/>
						<TextField
							label="Password"
							isRevealable
							placeholder="Enter your password"
							{...getInputProps(fields.password, { type: 'password' })}
							errors={fields.password.errors}
						/>

						<div className="flex justify-between items-center">
							<Checkbox>Remember me</Checkbox>
							<Link
								className="text-sm text-fg underline"
								to="/dashboard/forgot-password"
							>
								Forgot password?
							</Link>
						</div>
						<input {...getInputProps(fields.redirectTo, { type: 'hidden' })} />
					</Card.Content>
					<Card.Footer>
						<Stack
							fullWidth
							direction="row"
							align="center"
							justify="between"
							gap={3}
						>
							<Link
								className="text-sm text-fg underline"
								to="/dashboard/sign-up"
							>
								Create an account
							</Link>
							<Button type="submit">Login</Button>
						</Stack>
					</Card.Footer>
				</Card>
			</Form>
		</div>
	)
}
