import { Card } from '~/components/ui/card'

export default function DashboardPage() {
	return (
		<div className="grid lg:grid-cols-4 md:grid-cols-2 gap-4">
			<DummyCard />
			<DummyCard />
			<DummyCard />
			<DummyCard />
		</div>
	)
}

function DummyCard() {
	return (
		<Card>
			<Card.Header>
				<Card.Title>Dummy data</Card.Title>
				<Card.Description>4</Card.Description>
			</Card.Header>
		</Card>
	)
}
