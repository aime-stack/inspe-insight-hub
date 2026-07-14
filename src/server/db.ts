import postgres from "postgres";

// Server-only Postgres client (Supabase transaction pooler).
// Kept on globalThis so dev-server HMR doesn't leak connections.

const connectionString = process.env.DATABASE_URL ?? process.env.DIRECT_URL;

declare global {
  var __pgClient: ReturnType<typeof postgres> | undefined;
}

function createClient() {
  if (!connectionString) {
    throw new Error("DATABASE_URL (or DIRECT_URL) is not set");
  }
  return postgres(connectionString, {
    // The transaction pooler (port 6543) doesn't support prepared statements
    prepare: false,
    max: 10,
    idle_timeout: 30,
    // snake_case columns <-> camelCase JS keys
    transform: postgres.camel,
  });
}

export const sql = globalThis.__pgClient ?? createClient();
globalThis.__pgClient = sql;
