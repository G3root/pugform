import SQLite from 'better-sqlite3'
import {
	type Insertable,
	Kysely,
	type Selectable,
	SqliteDialect,
	type Updateable,
} from 'kysely'
import type { DB as Database, Field as FieldTable } from '~/generated/db-types' // this is the Database interface we defined earlier

const globalForDb = globalThis as unknown as {
	database: SQLite.Database | undefined
}

const DATABASE_URL = process.env.DATABASE_URL

const database = globalForDb.database ?? new SQLite(DATABASE_URL)

if (process.env.NODE_ENV !== 'production') globalForDb.database = database

const dialect = new SqliteDialect({
	database,
})

export const db = new Kysely<Database>({
	dialect,
})

export type TKyselyDb = typeof db

export type Field = Selectable<FieldTable>
export type NewField = Insertable<FieldTable>
export type FieldUpdate = Updateable<FieldTable>
