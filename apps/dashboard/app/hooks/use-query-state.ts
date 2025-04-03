import { useSearchParams } from 'react-router'

export function useQueryState<T>(key: string) {
	const [searchParams, setSearchParams] = useSearchParams()

	const value = searchParams.get(key)

	const setValue = (value?: string) => {
		const params = new URLSearchParams()
		if (value) {
			params.set(key, value)
		}
		setSearchParams(params)
	}

	return [value, setValue] as const
}
