import { Container } from '~/components/ui/container'
import { Description } from '~/components/ui/field'
import { Heading } from '~/components/ui/heading'
import { Stack } from '~/components/ui/stack'
import { CreateFormStepProvider } from '~/modules/workspace/components/create-form-steps/create-form-step-provider'
import { StepList } from '~/modules/workspace/components/create-form-steps/step-list'

export default function CreateFormPage() {
	return (
		<CreateFormStepProvider>
			<Container>
				<Stack gap={12}>
					<Stack direction="row" align="center" justify="center" fullWidth>
						<Stack align="center" gap={0}>
							<Heading>Create a Form</Heading>
							<Description className="text-center">
								Start collecting responses by creating or importing your form.
							</Description>
						</Stack>
					</Stack>

					<StepList />
				</Stack>
			</Container>
		</CreateFormStepProvider>
	)
}
