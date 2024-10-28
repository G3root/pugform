import { FormElementsDrawer } from '~/modules/builder/components/form-elements-drawer'
import { BuilderStoreProvider } from '~/modules/builder/providers/builder-store-provider'

export default function Builder() {
	return (
		<BuilderStoreProvider>
			<h1>Unknown Route</h1>
			<FormElementsDrawer />
		</BuilderStoreProvider>
	)
}
