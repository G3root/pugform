import { createActorContext } from '@xstate/react'
import { assign, setup } from 'xstate'

const formMachine = setup({
	types: {
		context: {} as {
			currentPage: number
			totalPages: number
			data: Record<string, string>
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
		}),
		decrementPage: assign({
			currentPage: ({ context }) => context.currentPage - 1,
		}),

		updateData: assign({
			data: ({ context, event }) =>
				event.type === 'UPDATE_DATA'
					? {
							...context.data,
							...event.data,
						}
					: context.data,
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
		data: {},
	}),
	states: {
		page: {
			on: {
				NEXT: [
					{
						guard: 'isLastPage',
						target: 'ending',
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
