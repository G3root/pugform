import { db } from '@pugform/database'

type BaseContext = {
	db: typeof db
}

export const createBaseContext = async () => {
	return { db }
}
