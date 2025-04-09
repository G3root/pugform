import { createId } from '@paralleldrive/cuid2'
import { customAlphabet } from 'nanoid'

export const shortId = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz')

const prefixes = {
	project: 'prj',
	member: 'mem',
	form: 'frm',
} as const

export function newId<TPrefix extends keyof typeof prefixes>(prefix: TPrefix) {
	return `${prefixes[prefix]}_${createId()}` as const
}

export const newPublicId = () => shortId(12)
