import { useSelector } from '@xstate/store/react'
import { AddQuestionMenu } from '~/modules/builder/components/add-question-menu'
import { BuilderBlock } from '~/modules/builder/components/builder-block'
import { BuilderHeader } from '~/modules/builder/components/builder-header'
import {
	BuilderStoreProvider,
	useBuilderStore,
} from '~/modules/builder/providers/builder-store-provider'

export default function Builder() {
	return (
		<BuilderStoreProvider>
			<BuilderHeader />

			<div className="container h-full py-6 w-full flex flex-col items-center gap-4 justify-center">
				<FieldItems />

				<AddQuestionMenu formPageId="page_1" />
			</div>
		</BuilderStoreProvider>
	)
}

function FieldItems() {
	const store = useBuilderStore()
	const fields = useSelector(store, (state) => state.context.fields)

	return (
		<div className="container mx-auto flex flex-col items-center w-full max-w-3xl">
			<div className="flex flex-col w-full  gap-4">
				{fields.map((item, index) => (
					<BuilderBlock index={index} key={item.id} {...item} />
				))}
			</div>
		</div>
	)
}
