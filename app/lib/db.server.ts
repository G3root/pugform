import SQLite from 'better-sqlite3'
import { Kysely, SqliteDialect } from 'kysely'
import type { DB as Database } from '~/generated/db-types' // this is the Database interface we defined earlier

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
