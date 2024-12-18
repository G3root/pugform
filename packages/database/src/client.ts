import {
	type Insertable,
	Kysely,
	PostgresDialect,
	type Selectable,
	type Updateable,
} from 'kysely'
import pg from 'pg'
import type {
	Answer as AnswerTable,
	DB as Database,
	Field as FieldTable,
	FormPage as FormPageTable,
	Integration as IntegrationTable,
	Membership as MembershipTable,
	Organization as OrganizationTable,
	User as UserTable,
} from './generated/db-types'

const DATABASE_URL = process.env.DATABASE_URL

const globalForDb = globalThis as unknown as {
	pool: pg.Pool | undefined
}
const pool = globalForDb.pool ?? new pg.Pool({ connectionString: DATABASE_URL })

if (process.env.NODE_ENV !== 'production') globalForDb.pool = pool

export const db = new Kysely<Database>({
	dialect: new PostgresDialect({
		pool,
	}),
})

export {
	jsonArrayFrom,
	jsonBuildObject,
	jsonObjectFrom,
} from 'kysely/helpers/postgres'

export type TKyselyDb = typeof db

export type Field = Selectable<FieldTable>
export type NewField = Insertable<FieldTable>
export type FieldUpdate = Updateable<FieldTable>

export type User = Selectable<UserTable>
export type NewUser = Insertable<UserTable>
export type UserUpdate = Updateable<UserTable>

export type Organization = Selectable<OrganizationTable>
export type NewOrganization = Insertable<OrganizationTable>
export type OrganizationUpdate = Updateable<OrganizationTable>

export type Membership = Selectable<MembershipTable>
export type NewMembership = Insertable<MembershipTable>
export type MembershipUpdate = Updateable<MembershipTable>

export type FormPage = Selectable<FormPageTable>
export type NewFormPage = Insertable<FormPageTable>
export type FormPageUpdate = Updateable<FormPageTable>

export type Answer = Selectable<AnswerTable>
export type NewAnswer = Insertable<AnswerTable>
export type AnswerUpdate = Updateable<AnswerTable>

export type Integration = Selectable<IntegrationTable>
export type NewIntegration = Insertable<IntegrationTable>
export type IntegrationUpdate = Updateable<IntegrationTable>
