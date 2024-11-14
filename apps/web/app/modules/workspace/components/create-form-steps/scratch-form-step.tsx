import { FormLayout } from '@pugform/database/enums'
import { useFetcher, useParams } from 'react-router';
import { ButtonPrimitive } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { Stack } from '~/components/ui/stack'
import { scratchFormActionIntent } from '~/routes/(application)/(dashboard)/forms/create-form'

export function ScratchFormStep() {
	return (
		<Stack
			direction="row"
			align="center"
			justify="center"
			className="flex-wrap"
		>
			<ClassicForm />
			<CardForm />
		</Stack>
	)
}

function CardForm() {
	const fetcher = useFetcher()
	const params = useParams()
	return (
		<fetcher.Form method="POST">
			<input
				type="hidden"
				name="workspacePublicId"
				value={params.workspaceId}
				readOnly
			/>
			<input type="hidden" name="layout" value={FormLayout.CARD} readOnly />
			<ButtonPrimitive
				type="submit"
				name="intent"
				value={scratchFormActionIntent}
			>
				<Card>
					<Card.Content className="p-0">
						<div className="bg-[#3B82F6] p-4 sm:p-6 text-white">
							<div className="bg-white/90 rounded-lg p-4 mb-4 aspect-[4/3]">
								{/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
								<svg viewBox="0 0 160 120" className="w-full h-full">
									<rect
										width="80"
										height="8"
										x="40"
										y="10"
										rx="4"
										fill="#E2E8F0"
									/>
									<circle cx="28" cy="40" r="5" fill="#3B82F6" />
									<rect
										width="96"
										height="6"
										x="40"
										y="37"
										rx="3"
										fill="#E2E8F0"
									/>
									<rect
										width="64"
										height="16"
										x="48"
										y="60"
										rx="3"
										fill="#3B82F6"
									/>
									<rect
										width="24"
										height="3"
										x="20"
										y="100"
										rx="1.5"
										fill="#3B82F6"
									/>
									<rect
										width="24"
										height="3"
										x="52"
										y="100"
										rx="1.5"
										fill="#E2E8F0"
									/>
									<rect
										width="24"
										height="3"
										x="84"
										y="100"
										rx="1.5"
										fill="#E2E8F0"
									/>
									<rect
										width="24"
										height="3"
										x="116"
										y="100"
										rx="1.5"
										fill="#E2E8F0"
									/>
								</svg>
							</div>
							<div className="text-left">
								<h3 className="font-semibold text-lg">Card Form</h3>
								<p className="text-white/90 text-sm">
									Present one question per page
								</p>
							</div>
						</div>
					</Card.Content>
				</Card>
			</ButtonPrimitive>
		</fetcher.Form>
	)
}

function ClassicForm() {
	const fetcher = useFetcher()
	const params = useParams()
	return (
		<fetcher.Form method="POST">
			<input
				type="hidden"
				name="workspacePublicId"
				value={params.workspaceId}
				readOnly
			/>
			<input type="hidden" name="layout" value={FormLayout.CLASSIC} readOnly />
			<ButtonPrimitive
				type="submit"
				name="intent"
				value={scratchFormActionIntent}
			>
				<Card>
					<Card.Content className="p-0">
						<div className="bg-[#9333EA] p-4 sm:p-6 text-white">
							<div className="bg-white/90 rounded-lg p-4 mb-4 aspect-[4/3]">
								{/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
								<svg viewBox="0 0 160 120" className="w-full h-full">
									<rect
										width="120"
										height="8"
										x="20"
										y="10"
										rx="4"
										fill="#E2E8F0"
									/>
									<circle cx="28" cy="35" r="5" fill="#9333EA" />
									<rect
										width="96"
										height="6"
										x="40"
										y="32"
										rx="3"
										fill="#E2E8F0"
									/>
									<circle cx="28" cy="55" r="5" fill="#9333EA" />
									<rect
										width="96"
										height="6"
										x="40"
										y="52"
										rx="3"
										fill="#E2E8F0"
									/>
									<circle cx="28" cy="75" r="5" fill="#9333EA" />
									<rect
										width="96"
										height="6"
										x="40"
										y="72"
										rx="3"
										fill="#E2E8F0"
									/>
									<circle cx="28" cy="95" r="5" fill="#9333EA" />
									<rect
										width="96"
										height="6"
										x="40"
										y="92"
										rx="3"
										fill="#E2E8F0"
									/>
									<rect
										width="64"
										height="16"
										x="20"
										y="110"
										rx="3"
										fill="#9333EA"
									/>
								</svg>
							</div>
							<div className="text-left">
								<h3 className="font-semibold text-lg">Classic Form</h3>
								<p className="text-white/90 text-sm">
									Display all questions on a single page
								</p>
							</div>
						</div>
					</Card.Content>
				</Card>
			</ButtonPrimitive>
		</fetcher.Form>
	)
}
