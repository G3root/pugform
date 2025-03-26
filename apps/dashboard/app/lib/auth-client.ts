import {
	organizationClient,
	passkeyClient,
	twoFactorClient,
} from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
	plugins: [passkeyClient(), twoFactorClient(), organizationClient()],
})

export const { signIn, signUp, signOut, useSession } = authClient
