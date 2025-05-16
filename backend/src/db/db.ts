import pgPromise from "pg-promise";

// sort this out for local and production
const pgp = pgPromise();

const db = pgp({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

export default db;
