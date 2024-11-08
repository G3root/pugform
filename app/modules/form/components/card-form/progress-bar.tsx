import { FormMachineContext } from '../../state-machines/form-machine'

export function ProgressBar() {
	const progress = FormMachineContext.useSelector(
		(state) => state.context.progressPercentage,
	)

	return (
		<div className="fixed top-0 left-0 w-full h-1 bg-primary/20 z-50">
			<div
				className="h-full bg-primary transition-all duration-500 ease-out"
				style={{ width: `${progress}%` }}
			/>
		</div>
	)
}
