import { Note } from './ui/note'

export type ListOfErrors = Array<string | null | undefined> | null | undefined

export function ErrorList({
	id,
	errors,
}: {
	errors?: ListOfErrors
	id?: string
}) {
	const errorsToRender = errors?.filter(Boolean)
	if (!errorsToRender?.length) return null
	return (
		<Note intent="danger">
			<ul id={id} className="flex flex-col gap-1">
				{errorsToRender.map((e) => (
					<li key={e}>{e}</li>
				))}
			</ul>
		</Note>
	)
}
