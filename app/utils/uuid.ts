import { createId } from '@paralleldrive/cuid2'
import { customAlphabet } from 'nanoid'

export const shortId = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz')

export const numberId = customAlphabet('0123456789')

const prefixes = {
	field: 'fld',
	page: 'pg',
	user: 'usr',
	organization: 'org',
	member: 'mbr',
	form: 'frm',
	workspace: 'ws',
} as const

export function newId<TPrefix extends keyof typeof prefixes>(prefix: TPrefix) {
	return `${prefixes[prefix]}_${createId()}` as const
}

export const newPublicId = () => shortId(12)
