import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import {
	Form,
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
import {
	checkEmailAvailability,
	requireAnonymous,
	signUp,
} from '~/utils/auth.server'
import { checkHoneypot } from '~/utils/honeypot.server'
import { setSessionTokenCookie } from '~/utils/session.server'
import {
	EmailSchema,
	PasswordAndConfirmPasswordSchema,
} from '~/utils/user-validation'

const SignUpSchema = z
	.object({
		email: EmailSchema,
		name: z.string(),
	})
	.and(PasswordAndConfirmPasswordSchema)

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

	const { email, name, password } = submission.value

	const session = await signUp({ email, name, password })

	return redirect('/dashboard/verify-email', {
		headers: {
			'Set-Cookie': setSessionTokenCookie(
				session.sessionToken,
				session.expiresAt,
			),
		},
	})
}

export default function SignUp() {
	const actionData = useActionData<typeof action>()
	const [searchParams] = useSearchParams()

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
		<div className="h-screen flex flex-col items-center justify-center">
			<Form method="POST" {...getFormProps(form)}>
				<Card className="max-w-md mx-auto">
					<Card.Header>
						<Card.Title>Sign Up</Card.Title>
						<Card.Description>
							Enter your information to create an account
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
						</Stack>
					</Card.Content>
					<Card.Footer>
						<Button type="submit" className="w-full">
							Create an account
						</Button>
					</Card.Footer>
				</Card>
			</Form>
		</div>
	)
}
