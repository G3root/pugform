import { useStore } from '@tanstack/react-store'
import { useId } from 'react'
import { useFieldContext } from '~/hooks/form-context'
import { Input } from './input'
import { Label } from './label'
interface TextFieldProps extends React.ComponentProps<'input'> {
	label: string
}

export function TextField({ label, id: idProp, ...props }: TextFieldProps) {
	const id = idProp ?? useId()
	const field = useFieldContext<string>()

	const errors = useStore(field.store, (state) => state.meta.errors)
	const isTouched = useStore(field.store, (state) => state.meta.isTouched)

	return (
		<div className="flex flex-col gap-2">
			<Label htmlFor={id}>{label}</Label>
			<Input
				{...props}
				onChange={(e) => field.handleChange(e.target.value)}
				id={id}
				name={field.name}
				value={field.state.value}
				onBlur={field.handleBlur}
			/>

			{isTouched && errors.length > 0 ? (
				<div className="flex flex-col gap-1">
					{errors.map((error: { message: string }) => (
						<p key={error.message} className="text-destructive text-sm">
							{error.message}
						</p>
					))}
				</div>
			) : null}
		</div>
	)
}
