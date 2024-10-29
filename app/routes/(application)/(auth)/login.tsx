import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { TextField } from '~/components/ui/text-field'

export default function Login() {
	return (
		<div className="flex items-center justify-center w-full h-full min-h-screen">
			<Card className="max-w-md mx-auto">
				<Card.Header>
					<Card.Title>Login</Card.Title>
				</Card.Header>
				<Card.Content className="space-y-6">
					<TextField isRequired label="Email" placeholder="Enter your email" />
					<TextField
						isRequired
						label="Password"
						isRevealable
						type="password"
						placeholder="Enter your password"
					/>
					<div className="flex justify-between items-center">
						{/* <Checkbox>Remember me</Checkbox> */}
						{/* <Link intent="primary" href="#">
            Forgot password?
          </Link> */}
					</div>
				</Card.Content>
				<Card.Footer>
					<Button className="w-full">Login</Button>
				</Card.Footer>
			</Card>
		</div>
	)
}
