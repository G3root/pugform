import { clsx } from 'clsx/lite'
import { type ComponentChildren, createContext } from 'preact'
import { useContext, useRef } from 'preact/hooks'
import { type AriaRadioProps, useRadio, useRadioGroup } from 'react-aria'
import {
	type RadioGroupProps,
	type RadioGroupState,
	useRadioGroupState,
} from 'react-stately'
import { fieldContainerStyles } from '../common/field-container'
import { labelStyles } from '../common/label'

const RadioContext = createContext<RadioGroupState | null>(null)

interface CardFormMultipleChoiceInputProps extends RadioGroupProps {
	label: string
	options: string[]
}

export function CardFormMultipleChoiceInput(
	props: CardFormMultipleChoiceInputProps,
) {
	const { options, ...rest } = props

	return (
		<RadioGroup {...rest}>
			{options.map((item) => (
				<Radio value={item} key={item} />
			))}
		</RadioGroup>
	)
}

interface RadioGroup extends RadioGroupProps {
	label: string
	children: ComponentChildren
}

function RadioGroup(props: RadioGroup) {
	const { children, label } = props
	const state = useRadioGroupState(props)
	const { radioGroupProps, labelProps } = useRadioGroup(props, state)

	return (
		<div className={fieldContainerStyles} {...radioGroupProps}>
			<h2 className={labelStyles} {...labelProps}>
				{label}
			</h2>
			<RadioContext.Provider value={state}>{children}</RadioContext.Provider>
		</div>
	)
}

interface RadioProps extends AriaRadioProps {}

function Radio(props: RadioProps) {
	const { children } = props
	// biome-ignore lint/style/noNonNullAssertion: <explanation>
	const state = useContext(RadioContext)!
	const ref = useRef(null)
	const { inputProps } = useRadio(props, state, ref)

	return (
		<label style={{ display: 'block' }}>
			<input {...inputProps} ref={ref} />
			{children}
		</label>
	)
}
