import {
  type Insertable,
  Kysely,
  PostgresDialect,
  type Selectable,
  type Updateable,
} from 'kysely';
import pg from 'pg';
import type { DB as Database, User as UserTable } from './generated/db-types';

const DATABASE_URL = process.env.DATABASE_URL;

const globalForDb = globalThis as unknown as {
  pool: pg.Pool | undefined;
};
const pool =
  globalForDb.pool ?? new pg.Pool({ connectionString: DATABASE_URL });

if (process.env.NODE_ENV !== 'production') {
  globalForDb.pool = pool;
}

export const db = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool,
  }),
});

export {
  jsonArrayFrom,
  jsonBuildObject,
  jsonObjectFrom,
} from 'kysely/helpers/postgres';

export type TKyselyDb = typeof db;

export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UserUpdate = Updateable<UserTable>;
