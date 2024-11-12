import { createActorContext } from '@xstate/react'
import { create } from 'mutative'
import { assign, setup } from 'xstate'

const formMachine = setup({
	types: {
		context: {} as {
			currentPage: number
			totalPages: number
			data: Record<string, string>[]
			progressPercentage: number
		},
		events: {} as
			| { type: 'NEXT' }
			| { type: 'PREV' }
			| {
					type: 'UPDATE_DATA'
					data: Record<string, string>
			  },
		input: {} as {
			currentPage: number
			totalPage: number
		},
	},
	actions: {
		incrementPage: assign({
			currentPage: ({ context }) => context.currentPage + 1,
			progressPercentage: ({ context }) =>
				((context.currentPage + 1) / context.totalPages) * 100,
		}),
		decrementPage: assign({
			currentPage: ({ context }) => context.currentPage - 1,
			progressPercentage: ({ context }) =>
				((context.currentPage - 1) / context.totalPages) * 100,
		}),

		updateData: assign({
			data: ({ context, event }) =>
				create(context.data, (draft) => {
					if (event.type === 'UPDATE_DATA') {
						draft.push(event.data)
					}
				}),
		}),
		setCompleteProgress: assign({
			progressPercentage: () => 100,
		}),
	},
	guards: {
		isLastPage: ({ context }) => context.currentPage === context.totalPages - 1,
		isNotFirstPage: ({ context }) => context.currentPage > 0,
	},
}).createMachine({
	id: 'form-machine',
	initial: 'page',
	context: ({ input }) => ({
		currentPage: input.currentPage,
		totalPages: input.totalPage,
		data: [],
		progressPercentage: (input.currentPage / input.totalPage) * 100,
	}),
	states: {
		page: {
			on: {
				NEXT: [
					{
						guard: 'isLastPage',
						target: 'ending',
						actions: 'setCompleteProgress',
					},
					{
						actions: 'incrementPage',
					},
				],
				PREV: {
					guard: 'isNotFirstPage',
					target: 'page',
					actions: 'decrementPage',
				},
				UPDATE_DATA: {
					actions: 'updateData',
				},
			},
		},
		ending: {
			type: 'final',
		},
	},
})

export const FormMachineContext = createActorContext(formMachine)
