import {
	ServerValidateError,
	createServerValidate,
	formOptions,
} from '@tanstack/react-form/remix'
import { useActionData } from 'react-router'
import { z } from 'zod'
import { useAppForm } from '~/hooks/form'
import { signUp } from '~/lib/auth-client.js'
import {
	EmailSchema,
	PasswordAndConfirmPasswordSchema,
} from '~/utils/user-validation.js'
import { NameSchema } from '~/utils/user-validation.js'
import type { Route } from './+types/sign-up.ts'

const FormSchema = z
	.object({
		name: NameSchema,
		email: EmailSchema,
	})
	.and(PasswordAndConfirmPasswordSchema)

const formOpts = formOptions({
	defaultValues: {
		name: '',
		email: '',
		password: '',
		confirmPassword: '',
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

export default function SignUpPage(props: Route.ComponentProps) {
	const actionData = useActionData()
	const form = useAppForm({
		...formOpts,
		validators: {
			onChange: FormSchema,
		},
		onSubmit: async ({ value }) => {
			await signUp.email({
				email: value.email,
				name: value.name,
				password: value.password,
				callbackURL: '/',
			})
		},
	})
	return (
		<div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
			<div className="w-full max-w-sm">
				<form
					className="flex flex-col gap-6"
					onSubmit={(e) => {
						e.preventDefault()
						e.stopPropagation()
						form.handleSubmit()
					}}
				>
					<form.AppField
						name="name"
						// biome-ignore lint/correctness/noChildrenProp: <explanation>
						children={(field) => <field.TextField label="Full Name" />}
					/>

					<form.AppField
						name="email"
						// biome-ignore lint/correctness/noChildrenProp: <explanation>
						children={(field) => <field.TextField label="Email" />}
					/>

					<form.AppField
						name="password"
						// biome-ignore lint/correctness/noChildrenProp: <explanation>
						children={(field) => <field.TextField label="Password" />}
					/>

					<form.AppField
						name="confirmPassword"
						// biome-ignore lint/correctness/noChildrenProp: <explanation>
						children={(field) => <field.TextField label="Confirm Password" />}
					/>

					<form.AppForm>
						<form.SubscribeButton label="Signup" />
					</form.AppForm>
				</form>
			</div>
		</div>
	)
}
