import {
	type MachineState,
	createMachine,
	guard,
	reduce,
	state,
	transition,
} from 'robot3'

const final = state

interface TContext {
	currentPage: number
	totalPages: number
}

const isLastPage = (context: TContext) =>
	context.currentPage !== context.totalPages - 1

const isNotFirstPage = (context: TContext) => context.currentPage > 0

const incrementPage = (context: TContext) => ({
	...context,
	currentPage: context.currentPage + 1,
	progressPercentage: ((context.currentPage + 1) / context.totalPages) * 100,
})

const decrementPage = (context: TContext) => ({
	...context,
	currentPage: context.currentPage - 1,
	progressPercentage: ((context.currentPage - 1) / context.totalPages) * 100,
})

export const formMachine = createMachine<
	{ page: MachineState; ending: MachineState },
	TContext
>(
	{
		page: state(
			transition('NEXT', 'ending', guard(isLastPage), reduce(incrementPage)),
			transition('NEXT', 'page', reduce(incrementPage)),
			transition('PREV', 'page', guard(isNotFirstPage), reduce(decrementPage)),
		),
		ending: final(),
	},
	(input: TContext) => ({
		currentPage: input.currentPage,
		totalPages: input.totalPages,
		progressPercentage: (input.currentPage / input.totalPages) * 100,
	}),
)
