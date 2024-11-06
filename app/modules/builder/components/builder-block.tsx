import {
	getFormProps,
	getInputProps,
	getTextareaProps,
	useForm,
	useFormMetadata,
} from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { Form } from '@remix-run/react'
import { IconSettings, IconTrash } from 'justd-icons'
import { z } from 'zod'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { Input } from '~/components/ui/field'
import { Sheet } from '~/components/ui/sheet'
import { Stack } from '~/components/ui/stack'
import { Switch } from '~/components/ui/switch'
import { TextField } from '~/components/ui/text-field'
import { Textarea } from '~/components/ui/textarea'
import type { useBuilderForm } from '../../form/hooks/use-builder-form'
import { humanizedFieldType } from '../constants'

interface BuilderBlockProps {
	formId: ReturnType<typeof useBuilderForm>[2]
	formPageIndex: number
}

export function BuilderBlock({ formId, formPageIndex }: BuilderBlockProps) {
	const form = useFormMetadata(formId)

	const fieldItems = form
		.getFieldset()
		.pages.getFieldList()
		[formPageIndex].getFieldset().fields
	const fields = fieldItems.getFieldList()

	return (
		<div className="container mx-auto flex flex-col items-center w-full max-w-3xl">
			<div className="flex flex-col w-full  gap-4">
				{fields.map((item, index) => {
					const itemFieldset = item.getFieldset()
					const label = itemFieldset.label
					const type = itemFieldset.type
					const itemId = itemFieldset.id
					const required = itemFieldset.required
					const placeholder = itemFieldset.placeholder
					const description = itemFieldset.description

					return (
						<Card key={item.key}>
							<Card.Header>
								<div className="flex items-center justify-between">
									<div>
										<div>
											<Badge>
												{
													humanizedFieldType[
														type.value as keyof typeof humanizedFieldType
													]
												}
											</Badge>
										</div>
									</div>
									<div>
										<BlockSettingsSheet
											index={index}
											formId={formId}
											formPageIndex={formPageIndex}
										/>
									</div>
								</div>
							</Card.Header>

							<Card.Content>
								<input
									{...getInputProps(type, { type: 'hidden' })}
									key={type.key}
									readOnly
								/>
								<input
									{...getInputProps(itemId, { type: 'hidden' })}
									key={itemId.key}
									readOnly
								/>
								<input
									{...getInputProps(required, { type: 'hidden' })}
									key={required.key}
									readOnly
								/>
								<input
									{...getInputProps(placeholder, { type: 'hidden' })}
									key={placeholder.key}
									readOnly
								/>
								<input
									{...getInputProps(description, { type: 'hidden' })}
									key={description.key}
									readOnly
								/>

								<Stack direction="row">
									<div className="flex-1">
										<label className="sr-only" htmlFor={`label-${item.key}`}>
											label
										</label>
										<Input
											{...getInputProps(label, { type: 'text' })}
											key={label.key}
											placeholder="type a question"
											id={`label-${item.key}`}
											className="border-b focus:border-primary"
										/>
									</div>
									<Button
										aria-label="delete field"
										appearance="outline"
										size="square-petite"
										intent="danger"
										onPress={() => {
											form.remove({ index, name: fieldItems.name })
										}}
									>
										<IconTrash />
									</Button>
								</Stack>
							</Card.Content>
						</Card>
					)
				})}
			</div>
		</div>
	)
}

const Schema = z.object({
	placeholder: z.string().optional(),
	description: z.string().optional(),
	required: z.coerce.boolean().optional(),
})

interface BlockSettingsSheetProps {
	formId: ReturnType<typeof useBuilderForm>[2]
	formPageIndex: number
	index: number
}

function BlockSettingsSheet({
	formId,
	formPageIndex,
	index,
}: BlockSettingsSheetProps) {
	const baseForm = useFormMetadata(formId)

	//@ts-expect-error
	const fieldItems = baseForm.value?.pages?.[formPageIndex]?.fields?.[index]

	const [form, fields] = useForm({
		id: 'data-form',
		constraint: getZodConstraint(Schema),

		onValidate({ formData }) {
			return parseWithZod(formData, { schema: Schema })
		},
		shouldRevalidate: 'onBlur',
		onSubmit(event, { submission }) {
			event.preventDefault()
			event.stopPropagation()

			if (submission?.payload) {
				baseForm.update({
					name: baseForm
						.getFieldset()
						.pages.getFieldList()
						[formPageIndex].getFieldset()
						.fields.getFieldList()[index].name,
					value: {
						...fieldItems,
						...submission.payload,
						required: submission?.payload?.required ?? false,
					},
				})
			}
		},
		defaultValue: {
			description: fieldItems?.description,
			placeholder: fieldItems?.placeholder,
			required: fieldItems?.required,
		},
	})

	return (
		<Sheet>
			<Button aria-label="Menu" size="square-petite" appearance="outline">
				<IconSettings />
			</Button>

			<Sheet.Content>
				<Sheet.Header>
					<Sheet.Title>Update User Settings</Sheet.Title>
					<Sheet.Description>
						Adjust your preferences and configurations here.
					</Sheet.Description>
				</Sheet.Header>
				<Sheet.Body>
					<Form method="POST" {...getFormProps(form)} className="space-y-4">
						<TextField
							label="Placeholder"
							{...getInputProps(fields.placeholder, { type: 'text' })}
							errors={fields.placeholder.errors}
						/>
						<Textarea
							label="Description"
							{...getTextareaProps(fields.description)}
							errors={fields.description.errors}
						/>
						<Switch
							{...getInputProps(fields.required, { type: 'checkbox' })}
							defaultSelected={fields.required.initialValue === 'on'}
						>
							Required
						</Switch>
					</Form>
				</Sheet.Body>
				<Sheet.Footer>
					<Sheet.Close>Cancel</Sheet.Close>
					<Button form={form.id} intent="primary" type="submit">
						Save Changes
					</Button>
				</Sheet.Footer>
			</Sheet.Content>
		</Sheet>
	)
}
