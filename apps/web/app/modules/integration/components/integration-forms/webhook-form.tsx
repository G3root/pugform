import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { Form, useActionData } from 'react-router'
import { Button } from '~/components/ui/button'
import { Modal } from '~/components/ui/modal'
import { TextField } from '~/components/ui/text-field'
import { WebhookConfigSchema } from '../../integrations/_schema'
import type { TIntegrationIds } from '../../schema'

interface WebHookFormProps {
	id: TIntegrationIds
}

export function WebHookForm({ id }: WebHookFormProps) {
	const actionData = useActionData()

	const [form, fields] = useForm({
		id: 'webhook-form',
		constraint: getZodConstraint(WebhookConfigSchema),

		lastResult: actionData?.result,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: WebhookConfigSchema })
		},
		shouldRevalidate: 'onBlur',
	})

	return (
		<>
			<Modal.Body>
				<Form method="POST" {...getFormProps(form)}>
					<input value={id} type="hidden" name="integrationId" />
					<TextField
						label="Endpoint URL"
						{...getInputProps(fields.webhookUrl, { type: 'url' })}
						errors={fields.webhookUrl.errors}
					/>
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button type="submit" form={form.id}>
					Connect
				</Button>
			</Modal.Footer>
		</>
	)
}
