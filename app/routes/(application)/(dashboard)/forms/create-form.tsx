import { Container } from '~/components/ui/container'
import { Description } from '~/components/ui/field'
import { Heading } from '~/components/ui/heading'
import { Stack } from '~/components/ui/stack'

export default function CreateFormPage() {
	return (
		<Container>
			<Stack direction="row" align="center" justify="center" fullWidth>
				<Stack align="center" gap={0}>
					<Heading>Create a Form</Heading>
					<Description className="text-center">
						Start collecting responses by creating or importing your form.
					</Description>
				</Stack>
			</Stack>
		</Container>
	)
}
