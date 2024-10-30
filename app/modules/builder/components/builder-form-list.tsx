import { getInputProps, useFormMetadata } from '@conform-to/react'
import { Fragment } from 'react'
import type { useBuilderForm } from '../hooks/use-builder-form'
import { AddQuestionMenu } from './add-question-menu'
import { BuilderBlock } from './builder-block'

interface BuilderFormListProps {
	formId: ReturnType<typeof useBuilderForm>[2]
}

export function BuilderFormList({ formId }: BuilderFormListProps) {
	const form = useFormMetadata(formId)

	const values = form.getFieldset().fieldPages.getFieldList()

	return values.map((item) => (
		<Fragment key={item.key}>
			<input {...getInputProps(item, { type: 'hidden' })} key={item.key} />
			<BuilderBlock formId={formId} formPageId={item.value as string} />
			<AddQuestionMenu formId={formId} formPageId={item.value as string} />
		</Fragment>
	))
}
