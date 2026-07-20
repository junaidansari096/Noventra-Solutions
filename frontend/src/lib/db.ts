import postgres from "postgres";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is missing!");
}

const globalForDb = global as unknown as { conn: postgres.Sql | undefined };

export const sql = globalForDb.conn ?? postgres(connectionString, {
  ssl: "require",
  max: 5, // Keep connection pool small for serverless
  idle_timeout: 20,
  connect_timeout: 10,
});

if (process.env.NODE_ENV !== "production") {
  globalForDb.conn = sql;
}
