import { betterAuth } from 'better-auth'
import { twoFactor } from 'better-auth/plugins'
import { organization } from 'better-auth/plugins'
import { passkey } from 'better-auth/plugins/passkey'
import { db } from './db'

export const auth = betterAuth({
	database: {
		db,
		type: 'postgres',
	},
	emailVerification: {
		async sendVerificationEmail({ user, url }) {
			console.log({ user, url })
		},
	},
	emailAndPassword: {
		enabled: true,
		sendEmailVerificationOnSignUp: true,

		async sendVerificationEmail() {
			console.log('Send email to verify email address')
		},
		async sendResetPassword(url, user) {
			console.log('Send email to reset password')
			console.log({ user, url })
		},
	},

	plugins: [
		twoFactor({
			otpOptions: {
				async sendOTP({ user, otp }) {
					// await resend.emails.send({
					// 	from,
					// 	to: user.email,
					// 	subject: 'Your OTP',
					// 	html: `Your OTP is ${otp}`,
					// })

					console.log({ user, otp })
				},
			},
		}),
		passkey(),
		organization(),
	],
})
