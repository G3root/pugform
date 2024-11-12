import * as React from 'react'

import { IconEye, IconEyeClosed } from 'justd-icons'
import {
	Button as ButtonPrimitive,
	TextField as TextFieldPrimitive,
	type TextFieldProps as TextFieldPrimitiveProps,
} from 'react-aria-components'

import type { FieldProps } from './field'

import type { ListOfErrors } from '../error-list'
import {
	Description,
	FieldError,
	FieldGroup,
	Input,
	Label,
	fieldGroupPrefixStyles,
} from './field'
import { Loader } from './loader'
import { ctr } from './primitive'

type InputType = Exclude<TextFieldPrimitiveProps['type'], 'password'>

interface BaseTextFieldProps extends TextFieldPrimitiveProps, FieldProps {
	prefix?: React.ReactNode
	suffix?: React.ReactNode
	isPending?: boolean
	className?: string
}

interface RevealableTextFieldProps extends BaseTextFieldProps {
	isRevealable: true
	type: 'password'
}

interface NonRevealableTextFieldProps extends BaseTextFieldProps {
	isRevealable?: never
	type?: InputType
}

type TextFieldProps = { errors?: ListOfErrors } & (
	| RevealableTextFieldProps
	| NonRevealableTextFieldProps
)

const TextField = ({
	placeholder,
	label,
	description,
	errorMessage,
	prefix,
	suffix,
	isPending,
	className,
	isRevealable,
	errors,
	type,
	...props
}: TextFieldProps) => {
	const [isPasswordVisible, setIsPasswordVisible] = React.useState(false)
	const inputType = isRevealable
		? isPasswordVisible
			? 'text'
			: 'password'
		: type

	const handleTogglePasswordVisibility = () => {
		setIsPasswordVisible((prev) => !prev)
	}

	const isInvalid = errors?.length ? true : undefined
	return (
		<TextFieldPrimitive
			type={inputType}
			{...props}
			className={ctr(className, 'group flex flex-col gap-1')}
			isInvalid={isInvalid}
		>
			{label && <Label>{label}</Label>}
			<FieldGroup
				data-loading={isPending ? 'true' : undefined}
				className={fieldGroupPrefixStyles({ className })}
			>
				{prefix ? (
					<span data-slot="prefix" className="atrs x2e2">
						{prefix}
					</span>
				) : null}
				<Input placeholder={placeholder} />
				{isRevealable ? (
					<ButtonPrimitive
						aria-label="Toggle password visibility"
						type="button"
						onPress={handleTogglePasswordVisibility}
						className="atrs relative [&>[data-slot=icon]]:text-muted-fg focus:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded"
					>
						{/* biome-ignore lint/complexity/noUselessFragments: <explanation> */}
						<>{isPasswordVisible ? <IconEyeClosed /> : <IconEye />}</>
					</ButtonPrimitive>
				) : isPending ? (
					<Loader variant="spin" data-slot="suffix" />
				) : suffix ? (
					<span data-slot="suffix" className="atrs x2e2">
						{suffix}
					</span>
				) : null}
			</FieldGroup>
			{description && <Description>{description}</Description>}
			<FieldError>
				{/* {errorMessage} */}

				{errors && errors?.length > 0 ? (
					<ul>
						{errors.map((error) => (
							<li key={error}>{error}</li>
						))}
					</ul>
				) : null}
			</FieldError>
		</TextFieldPrimitive>
	)
}

export { TextField, TextFieldPrimitive, type TextFieldProps }
