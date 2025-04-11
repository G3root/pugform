import { db } from '@pugform/database';
import { auth } from './auth';

type BaseContext = {
  db: typeof db;
};

export const createBaseContext = async (request: Request) => {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  return { db, session };
};

export type TBaseContext = Awaited<ReturnType<typeof createBaseContext>>;
