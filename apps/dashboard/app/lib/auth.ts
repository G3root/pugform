import { db } from '@pugform/database';
import { betterAuth } from 'better-auth';
import { twoFactor } from 'better-auth/plugins';
import { organization } from 'better-auth/plugins';
import { passkey } from 'better-auth/plugins/passkey';
import { newId } from '~/utils/uuid';
export const auth = betterAuth({
  database: {
    db,
    type: 'postgres',
  },

  emailVerification: {
    async sendVerificationEmail({ user, url }) {
      console.log({ user, url });
    },
  },
  emailAndPassword: {
    enabled: true,
    sendEmailVerificationOnSignUp: true,

    async sendVerificationEmail() {
      console.log('Send email to verify email address');
    },
    async sendResetPassword(url, user) {
      console.log('Send email to reset password');
      console.log({ user, url });
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

          console.log({ user, otp });
        },
      },
    }),
    passkey(),
    organization({
      allowUserToCreateOrganization: false,
    }),
  ],
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          const org = await db
            .insertInto('organization')
            .values({
              id: user.id,
              name: 'Personal',
              slug: user.id,
              logo: null,
              createdAt: new Date(),
            })
            .returningAll()
            .executeTakeFirstOrThrow();

          await db
            .insertInto('member')
            .values({
              id: newId('member'),
              organizationId: org.id,
              role: 'admin',
              createdAt: new Date(),
              userId: user.id,
            })
            .execute();
        },
      },
    },
    session: {
      create: {
        before: async (session) => {
          const organization = await db
            .selectFrom('organization')
            .where('id', '=', session.userId)
            .selectAll()
            .executeTakeFirstOrThrow();

          const member = await db
            .selectFrom('member')
            .where('organizationId', '=', organization.id)
            .where('userId', '=', session.userId)
            .selectAll()
            .executeTakeFirstOrThrow();

          return {
            data: {
              ...session,
              activeOrganizationId: organization.id,
              activeMemberId: member.id,
            },
          };
        },
      },
    },
  },

  session: {
    additionalFields: {
      activeMemberId: {
        type: 'string',
      },
    },
  },
});
