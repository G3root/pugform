import { Link, href } from 'react-router'

import { mergeForm, useTransform } from '@tanstack/react-form'
import {
	ServerValidateError,
	createServerValidate,
	formOptions,
} from '@tanstack/react-form/remix'
import { useActionData } from 'react-router'
import { z } from 'zod'
import { useAppForm } from '~/hooks/form'
import { EmailSchema, PasswordSchema } from '~/utils/user-validation'
import type { Route } from './+types/login'

const FormSchema = z.object({
	email: EmailSchema,
	password: PasswordSchema,
})

const formOpts = formOptions({
	defaultValues: {
		email: '',
		password: '',
	},
})

const serverValidate = createServerValidate({
	...formOpts,
	onServerValidate: async ({ value }) => {
		console.log(value, 'value')
	},
})

export async function action({ request }: Route.ActionArgs) {
	const formData = await request.formData()
	try {
		await serverValidate(formData)
	} catch (e) {
		if (e instanceof ServerValidateError) {
			return e.formState
		}

		throw e
	}

	return null
}

export default function LoginPage() {
	const actionData = useActionData()
	const form = useAppForm({
		...formOpts,
		validators: {
			onChange: FormSchema,
		},
		transform: useTransform(
			(baseForm) => mergeForm(baseForm, actionData ?? {}),
			[actionData],
		),
	})

	return (
		<div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
			<div className="w-full max-w-sm">
				<div className="flex flex-col gap-6">
					<form action="">
						<div className="flex flex-col gap-6">
							<div className="flex flex-col items-center gap-2">
								<Link
									to={href('/')}
									className="flex flex-col items-center gap-2 font-medium"
								>
									<span className="sr-only">Acme Inc.</span>
								</Link>
								<h1 className="font-bold text-xl">Welcome to Acme Inc.</h1>
								<div className="text-center text-sm">
									Don&apos;t have an account?{' '}
									<Link
										to={href('/sign-up')}
										className="underline underline-offset-4"
									>
										Sign up
									</Link>
								</div>
							</div>
							<div className="flex flex-col gap-6">
								<form.AppField
									name="email"
									// biome-ignore lint/correctness/noChildrenProp: <explanation>
									children={(field) => (
										<field.TextField label="Email" type="email" />
									)}
								/>

								<form.AppField
									name="password"
									// biome-ignore lint/correctness/noChildrenProp: <explanation>
									children={(field) => (
										<field.TextField label="Password" type="text" />
									)}
								/>

								<form.AppForm>
									<form.SubscribeButton label="Login" />
								</form.AppForm>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}
