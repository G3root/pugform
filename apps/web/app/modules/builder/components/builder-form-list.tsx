import { getInputProps, useFormMetadata } from '@conform-to/react'
import { Fragment, type ReactNode } from 'react'
import { Card } from '~/components/ui/card'
import { Stack } from '~/components/ui/stack'
import type { useBuilderForm } from '../../form/hooks/use-builder-form'
import { AddQuestionMenu } from './add-question-menu'
import { BuilderBlock } from './builder-block'

interface BuilderFormListProps {
	formId: ReturnType<typeof useBuilderForm>[2]
}

export function BuilderFormList({ formId }: BuilderFormListProps) {
	const form = useFormMetadata(formId)

	const values = form.getFieldset().pages.getFieldList()

	return values.map((item, index) => {
		const page = item.getFieldset()
		return (
			<PageCard key={item.key}>
				<input
					{...getInputProps(page.id, { type: 'hidden' })}
					key={page.id.key}
				/>
				<BuilderBlock formId={formId} formPageIndex={index} />
				<AddQuestionMenu formId={formId} formPageIndex={index} />
			</PageCard>
		)
	})
}

interface PageCardProps {
	children: ReactNode
}

function PageCard({ children }: PageCardProps) {
	return (
		<div className="bg-bg rounded-xl w-full border max-w-2xl">
			<Stack align="center" justify="center" className="p-6">
				{children}
			</Stack>
		</div>
	)
}
