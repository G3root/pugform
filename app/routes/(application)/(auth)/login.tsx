import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import {
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
	data,
	redirect,
} from '@remix-run/node'
import {
	Form,
	useActionData,
	useLoaderData,
	useSearchParams,
} from '@remix-run/react'
import { z } from 'zod'
import { ErrorList } from '~/components/error-list'
import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { TextField } from '~/components/ui/text-field'
import { login, requireAnonymous } from '~/utils/auth.server'
import { checkHoneypot } from '~/utils/honeypot.server'
import { setSessionTokenCookie } from '~/utils/session.server'
import { EmailSchema, PasswordSchema } from '~/utils/user-validation'

const LoginFormSchema = z.object({
	email: EmailSchema,
	password: PasswordSchema,
	redirectTo: z.string().optional(),
})

export async function loader({ request, context }: LoaderFunctionArgs) {
	requireAnonymous(context)

	const isDev = process.env.NODE_ENV === 'development'
	return {
		defaultValues: {
			email: isDev ? 'user1@example.com' : undefined,
			password: isDev ? 'P@ssw0rd!' : undefined,
		},
	}
}

export async function action({ request, context }: ActionFunctionArgs) {
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

export default function Login() {
	const actionData = useActionData<typeof action>()
	const data = useLoaderData<typeof loader>()

	const [searchParams] = useSearchParams()
	const redirectTo = searchParams.get('redirectTo')

	const [form, fields] = useForm({
		id: 'login-form',
		constraint: getZodConstraint(LoginFormSchema),
		defaultValue: { redirectTo, ...data.defaultValues },
		lastResult: actionData?.result,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: LoginFormSchema })
		},
		shouldRevalidate: 'onBlur',
	})

	return (
		<div className="h-screen flex flex-col items-center justify-center">
			<Form method="POST" {...getFormProps(form)}>
				<Card className="max-w-md mx-auto">
					<Card.Header>
						<Card.Title>Login</Card.Title>
					</Card.Header>
					<Card.Content className="space-y-6">
						<ErrorList errors={form.errors} id={form.errorId} />
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
							{/* <Checkbox>Remember me</Checkbox> */}
							{/* <Link intent="primary" href="#">
            Forgot password?
          </Link> */}
						</div>
					</Card.Content>
					<Card.Footer>
						<Button type="submit" className="w-full">
							Login
						</Button>
					</Card.Footer>
				</Card>
			</Form>
		</div>
	)
}
